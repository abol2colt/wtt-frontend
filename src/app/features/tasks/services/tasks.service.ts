import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, of, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskItem, TaskListResponse, TaskMutationPayload } from '../../../shared/models/task.model';
import { Project, ProjectDetailsResponse } from '../../../shared/models/project.model';

// TEMP: Contract wrapper adapter.
// Remove when backend provides direct GET /api/v1/tasks/ response.
interface TasksContractResponse {
  tasks_list: {
    requested_ui_response: TaskListResponse;
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

  private mockTasks: TaskItem[] = [
    {
      id: 259354,
      status: 'pending',
      title: '[IDEAL-901]: رفع مشکل موقعیت اسکرول',
      project_id: 30,
      project_title: 'NeoBRK',
      date: '1405-02-08',
      duration: 30,
      location: 'teleworking',
      start_time: '1405-02-08 09:00:00',
      end_time: '1405-02-08 09:30:00',
    },
    {
      id: 259355,
      status: 'approved',
      title: '[WTT-112]: اتصال داشبورد به API',
      project_id: 90,
      project_title: 'WTT',
      date: '1405-02-09',
      duration: 120,
      location: 'incompany_working',
      start_time: '1405-02-09 10:00:00',
      end_time: '1405-02-09 12:00:00',
    },
    {
      id: 259356,
      status: 'rejected',
      title: '[NeoBRK-45]: بررسی خطای فرم ورود',
      project_id: 30,
      project_title: 'NeoBRK',
      date: '1405-02-10',
      duration: 75,
      location: 'teleworking',
      start_time: '1405-02-10 13:00:00',
      end_time: '1405-02-10 14:15:00',
    },
  ];
  private getPagedMockTasks(page: number): TaskListResponse {
    const startIndex = (page - 1) * this.mockPageSize;
    const endIndex = startIndex + this.mockPageSize;

    return {
      data: this.mockTasks.slice(startIndex, endIndex),
      meta: {
        page,
        page_size: this.mockPageSize,
        total: this.mockTasks.length,
      },
    };
  }

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
  getTasks(userId: number, page: number, range: string) {
    if (this.useMock) {
      return of(this.getPagedMockTasks(page)).pipe(delay(500));
    }

    if (environment.useContractApi) {
      // TEMP: Contract wrapper adapter.
      // Remove this block when backend provides direct GET /api/v1/tasks/ response.
      return this.http
        .get<TasksContractResponse>(`${environment.contractBaseUrl}/taskscontract/`)
        .pipe(map((response) => response.tasks_list.requested_ui_response));
    }

    const params = new HttpParams().set('user', userId).set('page', page).set('range', range);

    return this.http.get<TaskListResponse>(`${this.apiBaseUrl}/tasks/`, {
      params,
    });
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

      this.mockTasks = [createdTask, ...this.mockTasks];

      return of(createdTask).pipe(delay(500));
    }

    return this.http.post<TaskItem>(`${this.apiBaseUrl}/tasks/`, payload);
  }

  updateTask(taskId: number, payload: TaskMutationPayload) {
    if (this.useMock) {
      const updatedTask = this.buildTaskFromPayload(payload, taskId, 'edited');

      this.mockTasks = this.mockTasks.map((task) => (task.id === taskId ? updatedTask : task));

      return of(updatedTask).pipe(delay(500));
    }

    return this.http.put<TaskItem>(`${this.apiBaseUrl}/tasks/${taskId}/`, payload);
  }
  deleteTask(taskId: number): Observable<void> {
    if (this.useMock) {
      this.mockTasks = this.mockTasks.filter((task) => task.id !== taskId);

      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${taskId}/`);
  }
}
