import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface IntegrationStatusResponse {
  ok: boolean;
  jira: { mode: string };
  gitlab: { mode: string };
  ai: { mode: string };
  missingEnv?: string[];
}

export interface JiraConfigurePayload {
  baseUrl: string;
  email: string;
  token: string;
  apiVersion?: string;
  jql?: string;
  projectId?: number;
  serviceId?: number;
  contractId?: number;
}

export interface GitLabConfigurePayload {
  baseUrl: string;
  token: string;
  username?: string;
  projectId: string;
  branchPattern?: string;
}

@Injectable({ providedIn: 'root' })
export class IntegrationSettingsService {
  private readonly http = inject(HttpClient);
  private readonly proxyUrl = environment.integrationProxyBaseUrl.replace(/\/$/, '');

  getStatus(): Observable<IntegrationStatusResponse> {
    return this.http
      .get<IntegrationStatusResponse>(`${this.proxyUrl}/integrations/status`)
      .pipe(catchError((error) => this.handleError(error, 'دریافت وضعیت اتصال‌ها ناموفق بود.')));
  }

  testJira(payload: JiraConfigurePayload): Observable<unknown> {
    return this.http
      .post(`${this.proxyUrl}/integrations/test/jira`, payload)
      .pipe(catchError((error) => this.handleError(error, 'تست اتصال Jira ناموفق بود.')));
  }

  configureJira(payload: JiraConfigurePayload): Observable<unknown> {
    return this.http
      .post(`${this.proxyUrl}/integrations/configure/jira`, payload)
      .pipe(catchError((error) => this.handleError(error, 'ذخیره اتصال Jira ناموفق بود.')));
  }

  testGitLab(payload: GitLabConfigurePayload): Observable<unknown> {
    return this.http
      .post(`${this.proxyUrl}/integrations/test/gitlab`, payload)
      .pipe(catchError((error) => this.handleError(error, 'تست اتصال GitLab ناموفق بود.')));
  }

  configureGitLab(payload: GitLabConfigurePayload): Observable<unknown> {
    return this.http
      .post(`${this.proxyUrl}/integrations/configure/gitlab`, payload)
      .pipe(catchError((error) => this.handleError(error, 'ذخیره اتصال GitLab ناموفق بود.')));
  }

  private handleError(error: unknown, fallback: string) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return throwError(() => new Error('wtt-proxy در دسترس نیست. اول proxy را اجرا کن.'));
      }

      return throwError(() => new Error(error.error?.error || error.error?.message || fallback));
    }

    return throwError(() => new Error(fallback));
  }
}
