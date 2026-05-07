import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DashboardLinePoint,
  DashboardPieItem,
  DashboardStatsResponse,
  MessageCountResponse,
} from '../../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly useMock = environment.useMockData;

  getStats(userId: number, range: string) {
    console.log('وضعیت ماک دیتا در این لحظه:', this.useMock);
    if (this.useMock) {
      const mockResponse: DashboardStatsResponse = {
        data: {
          first_name: 'مهدی',
          last_name: 'کریمی',
          expected_time: 6336,
          total_work: 6824,
          overtime_working: 488,
          this_year_vacations: 2,
        },
      };
      return of(mockResponse).pipe(delay(800));
    }

    const params = new HttpParams().set('user', userId).set('range', range);
    return this.http.get<DashboardStatsResponse>(`${this.apiBaseUrl}/users/a_user_details/`, {
      params,
    });
  }

  getPieChart(userId: number, range: string) {
    if (this.useMock) {
      const mockResponse: DashboardPieItem[] = [
        { project: 'NeoBRK', value: 2625 },
        { project: 'غیر مفید', value: 1468 },
      ];
      return of(mockResponse).pipe(delay(800));
    }

    const params = new HttpParams().set('user', userId).set('range', range);
    return this.http.get<DashboardPieItem[]>(`${this.apiBaseUrl}/dashboard/pie_chart/`, { params });
  }

  getLineChart(userId: number, range: string) {
    if (this.useMock) {
      const mockResponse: DashboardLinePoint[] = [
        {
          date: '1405-01-26',
          presence: 549,
          rejected: 0,
          pending: 0,
          teleworking: 0,
          incompany_working: 435,
        },
      ];
      return of(mockResponse).pipe(delay(800));
    }

    const params = new HttpParams().set('user', userId).set('range', range);
    return this.http.get<DashboardLinePoint[]>(`${this.apiBaseUrl}/dashboard/line_chart/`, {
      params,
    });
  }

  getUnreadMessages() {
    if (this.useMock) {
      const mockResponse: MessageCountResponse = { private: 0, public: 82, regulations: 0 };
      return of(mockResponse).pipe(delay(800));
    }

    const params = new HttpParams().set('state', 'unread_count');
    return this.http.get<MessageCountResponse>(`${this.apiBaseUrl}/news/get_message_data/`, {
      params,
    });
  }
}
