import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  getStats(userId: number, range: string) {
    const params = new HttpParams().set('user', userId).set('range', range);

    return this.http.get<DashboardStatsResponse>(`${this.apiBaseUrl}/users/a_user_details/`, {
      params,
    });
  }

  getPieChart(userId: number, range: string) {
    const params = new HttpParams().set('user', userId).set('range', range);

    return this.http.get<DashboardPieItem[]>(`${this.apiBaseUrl}/dashboard/pie_chart/`, { params });
  }

  getLineChart(userId: number, range: string) {
    const params = new HttpParams().set('user', userId).set('range', range);

    return this.http.get<DashboardLinePoint[]>(`${this.apiBaseUrl}/dashboard/line_chart/`, {
      params,
    });
  }

  getUnreadMessages() {
    const params = new HttpParams().set('state', 'unread_count');

    return this.http.get<MessageCountResponse>(`${this.apiBaseUrl}/news/get_message_data/`, {
      params,
    });
  }
}
