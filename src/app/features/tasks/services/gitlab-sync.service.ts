import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface JiraTask {
  id: string;
  key?: string;
  title: string;

  project_id: number;
  project_title?: string;

  service_id: number;
  service_title?: string;

  contract_id: number;
  contract_title?: string;

  branch_name?: string;
  status?: string;
  estimated_minutes?: number;
}

export interface GitlabSyncResponse {
  success: boolean;
  description?: string;
  durationMinutes?: number;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class GitlabSyncService {
  private readonly http = inject(HttpClient);
  private readonly proxyUrl = environment.integrationProxyBaseUrl.replace(/\/$/, '');

  syncCommits(task: JiraTask): Observable<GitlabSyncResponse> {
    const params = new URLSearchParams();

    params.set('taskKey', task.key ?? task.id);

    if (task.branch_name) {
      params.set('branch', task.branch_name);
    }

    if (task.estimated_minutes) {
      params.set('estimatedMinutes', String(task.estimated_minutes));
    }

    return this.http.get<GitlabSyncResponse>(`${this.proxyUrl}/sync-gitlab?${params.toString()}`);
  }

  getJiraTasks(): Observable<JiraTask[]> {
    return this.http.get<JiraTask[]>(`${this.proxyUrl}/jira/mock-tasks`);
  }
}
