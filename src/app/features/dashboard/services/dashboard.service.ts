import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  DashboardLinePoint,
  DashboardPieItem,
  DashboardProfileSummaryResponse,
  DashboardStatsResponse,
  MessageCountResponse,
  NewsMessagesCountResponse,
  NewsMessagesResponse,
} from '../../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  getStats(userId: number, range: string) {
    const params = new HttpParams().set('range', range).set('user', userId).set('page', 1);

    // Real WTT v1 endpoint verified from production Network tab.
    return this.http.get<DashboardStatsResponse>(`${this.apiBaseUrl}/dashboard/a_user_details`, {
      params,
    });
  }

  getPieChart(userId: number, range: string) {
    const params = new HttpParams().set('user', userId).set('range', range);

    // Real WTT v1 endpoint verified from production Network tab.
    return this.http.get<DashboardPieItem[]>(`${this.apiBaseUrl}/dashboard/pie_chart`, {
      params,
    });
  }

  getLineChart(userId: number, range: string) {
    const params = new HttpParams().set('user', userId).set('range', range);

    // Real WTT v1 endpoint verified from production Network tab.
    return this.http.get<DashboardLinePoint[]>(`${this.apiBaseUrl}/dashboard/line_chart`, {
      params,
    });
  }

  getUnreadMessages() {
    const params = new HttpParams().set('state', 'unread_count');

    // Real WTT v1 endpoint verified from production Network tab.
    return this.http.get<MessageCountResponse>(`${this.apiBaseUrl}/news/get_message_data/`, {
      params,
    });
  }
  getNewsMessages(type: 'public' | 'private', range: string, page = 1, state = 'all') {
    const params = new HttpParams()
      .set('range', range)
      .set('type', type)
      .set('page', page)
      .set('state', state);

    // Real WTT v1 endpoint for dashboard announcement lists.
    return this.http.get<NewsMessagesResponse>(`${this.apiBaseUrl}/news/get_message_data/`, {
      params,
    });
  }

  getNewsMessagesCount(type: 'public' | 'private', range: string) {
    const params = new HttpParams().set('range', range).set('type', type);

    // Real WTT v1 endpoint for announcement counters.
    return this.http.get<NewsMessagesCountResponse>(`${this.apiBaseUrl}/news/messages_count/`, {
      params,
    });
  }
  getProfileSummary(userId: number, range: string, page = 1) {
    const params = new HttpParams().set('range', range).set('user', userId).set('page', page);

    // Real WTT v1 endpoint for dashboard profile and productivity summary.
    return this.http.get<DashboardProfileSummaryResponse>(`${this.apiBaseUrl}/dashboard/profile`, {
      params,
    });
  }
}
