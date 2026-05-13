import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class GitlabSyncService {
  private http = inject(HttpClient);
  private readonly PROXY_URL = 'http://localhost:3000/api';
  syncCommits(task: JiraTask): Observable<any> {
    const params = new URLSearchParams();

    params.set('taskKey', task.key ?? task.id);

    if (task.branch_name) {
      params.set('branch', task.branch_name);
    }

    if (task.estimated_minutes) {
      params.set('estimatedMinutes', String(task.estimated_minutes));
    }

    return this.http.get(`${this.PROXY_URL}/sync-gitlab?${params.toString()}`);
  }
  getJiraTasks(): Observable<JiraTask[]> {
    return this.http.get<JiraTask[]>(`${this.PROXY_URL}/jira/mock-tasks`);
  }
}
