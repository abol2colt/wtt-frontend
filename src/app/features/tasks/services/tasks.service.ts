import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, of, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskItem, TaskListResponse, TaskMutationPayload } from '../../../shared/models/task.model';
import { Project, ProjectDetailsResponse } from '../../../shared/models/project.model';

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

  getTasks(userId: number, page: number, range: string) {
    if (environment.useContractApi) {
      console.log('Reading tasks from contract API');

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
            date: '1405-02-08',
            duration: 30,
          },
          {
            id: 259355,
            status: 'approved',
            title: '[WTT-112]: اتصال داشبورد به API',
            project_id: 30,
            date: '1405-02-09',
            duration: 120,
          },
          {
            id: 259356,
            status: 'rejected',
            title: '[NeoBRK-45]: بررسی خطای فرم ورود',
            project_id: 90,
            date: '1405-02-10',
            duration: 75,
          },
        ],
        meta: {
          page,
          page_size: 3,
          total: 9,
        },
      };

      return of(mockResponse).pipe(delay(700));
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
      const mockCreatedTask: TaskItem = {
        id: Date.now(),
        status: 'pending',
        title: payload.title,
        project_id: payload.project,
        date: payload.date,
        duration: payload.duration,
        location: payload.location,
        start_time: payload.start_time,
        end_time: payload.end_time,
      };

      return of(mockCreatedTask).pipe(delay(700));
    }
    return this.http.post<TaskItem>(`${this.apiBaseUrl}/tasks/`, payload);
  }
  updateTask(taskId: number, payload: TaskMutationPayload) {
    if (this.useMock) {
      const mockUpdatedTask: TaskItem = {
        id: taskId,
        status: 'edited',
        title: payload.title,
        project_id: payload.project,
        date: payload.date,
        duration: payload.duration,
        location: payload.location,
        start_time: payload.start_time,
        end_time: payload.end_time,
      };
      return of(mockUpdatedTask).pipe(delay(700));
    }
    return this.http.put<TaskItem>(`${this.apiBaseUrl}/tasks/${taskId}/`, payload);
  }
  deleteTask(taskId: number): Observable<void> {
    if (this.useMock || environment.useContractApi) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${taskId}/`);
  }
}
