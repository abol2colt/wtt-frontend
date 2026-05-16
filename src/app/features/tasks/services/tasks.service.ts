import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  TaskItem,
  TaskListQuery,
  TaskListResponse,
  TaskMutationPayload,
  TasksCountResponse,
} from '../../../shared/models/task.model';
import { Project, ProjectDetailsResponse } from '../../../shared/models/project.model';

// TEMP: Contract wrapper adapter.
// Remove when backend provides direct GET /api/v1/tasks/ response.
interface WttProjectsResponse {
  my_projects?: Project[];
  all_projects?: Project[];
  all_active_projects?: Project[];
}
interface WttTaskListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WttTaskItem[];
}

interface WttTaskItem {
  id: number;
  status: string;
  title: string;
  project?: {
    id: number;
    title: string;
  };
  date: string;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  description?: string;
  location?: string;
  editable?: boolean;
  project_contract?: {
    id: number;
    contract: string;
  };
  project_service?: {
    id: number;
    service: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly realPageSize = 10;

  private readonly testTaskPrefix = environment.taskMutationTestPrefix;

  private assertMutationEnabled(): void {
    if (!environment.enableRealTaskMutation) {
      throw new Error('Real task mutation is disabled by environment safety flag.');
    }
  }

  private assertTestTaskTitle(title: string, action: string): void {
    if (!title?.startsWith(this.testTaskPrefix)) {
      throw new Error(
        `${action} فقط برای تسک تستی مجاز است. عنوان باید با ${this.testTaskPrefix} شروع شود.`,
      );
    }
  }

  getTasks(_userId: number, query: TaskListQuery): Observable<TaskListResponse> {
    const page = query.page ?? 1;
    const params = this.buildTaskQueryParams(query, true);

    return this.http
      .get<WttTaskListResponse>(`${this.apiBaseUrl}/tasks/`, { params })
      .pipe(map((response) => this.mapWttTaskListResponse(response, page)));
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<WttProjectsResponse>(`${this.apiBaseUrl}/project/get_all_projects/`)
      .pipe(
        map((response) =>
          response.all_active_projects?.length
            ? response.all_active_projects
            : (response.all_projects ?? response.my_projects ?? []),
        ),
      );
  }
  getProjectDetails(projectId: number): Observable<ProjectDetailsResponse> {
    const params = new HttpParams().set('id', projectId);

    return this.http.get<ProjectDetailsResponse>(`${this.apiBaseUrl}/project/project_details/`, {
      params,
    });
  }

  createTask(payload: TaskMutationPayload): Observable<TaskItem> {
    this.assertMutationEnabled();
    this.assertTestTaskTitle(payload.title, 'ثبت');

    return this.http.post<TaskItem>(`${this.apiBaseUrl}/tasks/`, payload);
  }

  updateTask(taskId: number, payload: TaskMutationPayload): Observable<TaskItem> {
    this.assertMutationEnabled();
    this.assertTestTaskTitle(payload.title, 'ویرایش');

    return this.http.put<TaskItem>(`${this.apiBaseUrl}/tasks/${taskId}/`, payload);
  }

  deleteTask(taskId: number, title: string): Observable<void> {
    this.assertMutationEnabled();
    this.assertTestTaskTitle(title, 'حذف');

    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${taskId}/`);
  }

  private mapWttTaskListResponse(response: WttTaskListResponse, page: number): TaskListResponse {
    return {
      data: response.results.map((task) => this.mapWttTaskItem(task)),
      meta: {
        page,
        page_size: this.realPageSize,
        total: response.count,
      },
    };
  }

  private mapWttTaskItem(task: WttTaskItem): TaskItem {
    return {
      id: task.id,
      status: this.mapWttTaskStatus(task.status),
      title: task.title,
      project_id: task.project?.id ?? 0,
      project_title: task.project?.title ?? 'بدون پروژه',
      date: task.date,
      duration: task.duration,
      location: task.location,
      start_time: task.start_time ?? undefined,
      end_time: task.end_time ?? undefined,
      description: task.description,
      editable: task.editable,
      project_contract: task.project_contract,
      project_service: task.project_service,
    };
  }

  private buildTaskQueryParams(query: TaskListQuery, includePage = false): HttpParams {
    let params = new HttpParams();

    if (includePage) {
      params = params.set('page', query.page ?? 1);
    }

    if (query.range) params = params.set('range', query.range);
    if (query.start_date) params = params.set('start_date', query.start_date);
    if (query.end_date) params = params.set('end_date', query.end_date);

    if (query.project) params = params.set('project', query.project);
    if (query.project_contract) params = params.set('project_contract', query.project_contract);
    if (query.project_service) params = params.set('project_service', query.project_service);

    if (query.teleworking === true) params = params.set('teleworking', 'true');
    if (query.favorite === true) params = params.set('favorite', 'true');

    return params;
  }
  private mapWttTaskStatus(status: string): TaskItem['status'] {
    switch (status) {
      case 'accept':
        return 'approved';

      case 'reject':
        return 'rejected';

      default:
        return status as TaskItem['status'];
    }
  }
  getTasksCount(query: TaskListQuery): Observable<TasksCountResponse> {
    const params = this.buildTaskQueryParams(query);

    return this.http.get<TasksCountResponse>(`${this.apiBaseUrl}/tasks/tasks_count/`, {
      params,
    });
  }
}
