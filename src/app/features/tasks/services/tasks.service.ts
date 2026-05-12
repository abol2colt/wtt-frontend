import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, of, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  TaskItem,
  TaskListResponse,
  TaskMutationPayload,
  TasksCountResponse,
} from '../../../shared/models/task.model';
import { Project, ProjectDetailsResponse } from '../../../shared/models/project.model';

// TEMP: Contract wrapper adapter.
// Remove when backend provides direct GET /api/v1/tasks/ response.
interface TasksContractResponse {
  tasks_list: {
    requested_ui_response: TaskListResponse;
  };
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
  private readonly useMock = environment.useMockData;

  private readonly mockPageSize = 3;

  private buildTaskFromPayload(
    payload: TaskMutationPayload,
    id = Date.now(),
    status: TaskItem['status'] = 'pending',
  ): TaskItem {
    const projectTitleMap: Record<number, string> = {
      30: 'NeoBRK',
      90: 'WTT',
      120: 'IDEAL',
    };

    return {
      id,
      status,
      title: payload.title,
      project_id: payload.project,
      project_title: projectTitleMap[payload.project] ?? `پروژه #${payload.project}`,
      date: payload.date,
      duration: payload.duration,
      location: payload.location,
      start_time: payload.start_time,
      end_time: payload.end_time,
    };
  }
  getTasks(userId: number, page: number, range: string): Observable<TaskListResponse> {
    if (environment.useContractApi) {
      return this.http
        .get<TasksContractResponse>(`${environment.contractBaseUrl}/taskscontract/`)
        .pipe(map((response) => response.tasks_list.requested_ui_response));
    }

    if (this.useMock) {
      const mockResponse: TaskListResponse = {
        data: [
          {
            id: 259354,
            status: 'pending',
            title: `[Page ${page}] [IDEAL-901]: رفع مشکل موقعیت اسکرول`,
            project_id: 30,
            project_title: 'NeoBRK',
            date: '1405-02-08',
            duration: 30,
          },
        ],
        meta: {
          page,
          page_size: 10,
          total: 1,
        },
      };

      return of(mockResponse).pipe(delay(700));
    }

    const params = new HttpParams().set('page', page).set('range', range);

    // Real WTT v1 infers the user from token. Keep userId in method signature for component compatibility.
    return this.http
      .get<WttTaskListResponse>(`${this.apiBaseUrl}/tasks/`, { params })
      .pipe(map((response) => this.mapWttTaskListResponse(response, page)));
  }

  getProjects() {
    if (this.useMock) {
      const mockProjects: Project[] = [
        { id: 30, title: 'NeoBRK', description: 'NeoBRK' },
        { id: 90, title: 'WTT', description: 'Work Time Tracker' },
        { id: 120, title: 'IDEAL', description: 'IDEAL project' },
      ];
      return of(mockProjects).pipe(delay(500));
    }
    return this.http.get<Project[]>(`${this.apiBaseUrl}/projects/get_all_projects/`);
  }

  getProjectDetails(projectId: number) {
    if (this.useMock) {
      const mockDetails: ProjectDetailsResponse = {
        services: [
          { id: 154, service: 'Frontend Development' },
          { id: 155, service: 'Bug Fixing' },
          { id: 156, service: 'Code Review' },
        ],
        contracts: [
          { id: 23, contract: 'Main Contract' },
          { id: 24, contract: 'Support Contract' },
        ],
      };
      return of(mockDetails).pipe(delay(500));
    }
    const params = new HttpParams().set('project', projectId);

    return this.http.get<ProjectDetailsResponse>(`${this.apiBaseUrl}/projects/project_details/`, {
      params,
    });
  }

  createTask(payload: TaskMutationPayload) {
    if (this.useMock) {
      const createdTask = this.buildTaskFromPayload(payload);

      return of(createdTask).pipe(delay(500));
    }

    return this.http.post<TaskItem>(`${this.apiBaseUrl}/tasks/`, payload);
  }

  updateTask(taskId: number, payload: TaskMutationPayload) {
    if (this.useMock) {
      const updatedTask = this.buildTaskFromPayload(payload, taskId, 'edited');

      return of(updatedTask).pipe(delay(500));
    }

    return this.http.put<TaskItem>(`${this.apiBaseUrl}/tasks/${taskId}/`, payload);
  }
  deleteTask(taskId: number): Observable<void> {
    if (this.useMock) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${taskId}/`);
  }
  private mapWttTaskListResponse(response: WttTaskListResponse, page: number): TaskListResponse {
    return {
      data: response.results.map((task) => this.mapWttTaskItem(task)),
      meta: {
        page,
        page_size: response.results.length || 10,
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
  getTasksCount(range: string) {
    const params = new HttpParams().set('range', range);

    // Real WTT v1 endpoint for task counters.
    return this.http.get<TasksCountResponse>(`${this.apiBaseUrl}/tasks/tasks_count/`, {
      params,
    });
  }
}
