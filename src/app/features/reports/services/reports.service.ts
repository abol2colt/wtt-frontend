import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { TaskItem } from '../../../shared/models/task.model';
import {
  ActivityInProjectsReportResponse,
  ReportAiSummaryPayload,
  ReportAiSummaryResponse,
  ReportRange,
  UserAttendanceReportResponse,
} from '../../../shared/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly integrationProxyBaseUrl = environment.integrationProxyBaseUrl;

  getUserAttendance(range: ReportRange) {
    const params = new HttpParams().set('range', range);

    return this.http.get<UserAttendanceReportResponse>(
      `${this.apiBaseUrl}/report/user_attendance`,
      { params },
    );
  }

  getActivityInProjects(range: ReportRange) {
    const params = new HttpParams().set('range', range);

    return this.http.get<ActivityInProjectsReportResponse>(
      `${this.apiBaseUrl}/report/activity_in_projects/`,
      { params },
    );
  }

  generateAiSummary(payload: ReportAiSummaryPayload) {
    return this.http.post<ReportAiSummaryResponse>(
      `${this.integrationProxyBaseUrl}/reports/ai-summary`,
      payload,
    );
  }

  getReportTasks(range: ReportRange) {
    const params = new HttpParams().set('range', range).set('page', 1);

    return this.http
      .get<{
        data?: TaskItem[];
        results?: TaskItem[];
      }>(`${this.apiBaseUrl}/tasks/`, { params })
      .pipe(map((response) => response.data ?? response.results ?? []));
  }

  formatMinutes(minutes: number | null | undefined): string {
    const safe = Math.max(0, Math.floor(Number(minutes) || 0));
    const hours = Math.floor(safe / 60);
    const mins = safe % 60;

    if (hours === 0) return `${mins}دقیقه`;
    if (mins === 0) return `${hours}ساعت`;
    return `${hours}ساعت ${mins}دقیقه`;
  }

  formatSignedMinutes(minutes: number | null | undefined): string {
    const value = Math.floor(Number(minutes) || 0);
    const sign = value < 0 ? '-' : value > 0 ? '+' : '';
    return `${sign}${this.formatMinutes(Math.abs(value))}`;
  }
}
