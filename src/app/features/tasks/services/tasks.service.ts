import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskListResponse } from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly useMock = environment.useMockData;

  getTasks(userId: number, page: number, range: string) {
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
}
