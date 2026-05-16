import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExternalTaskSourceItem, GitEvidenceSyncResponse } from '../../../shared/models/task.model';

@Injectable({ providedIn: 'root' })
export class GitlabSyncService {
  private readonly http = inject(HttpClient);
  private readonly proxyUrl = environment.integrationProxyBaseUrl.replace(/\/$/, '');

  syncEvidence(task: ExternalTaskSourceItem): Observable<GitEvidenceSyncResponse> {
    const params = new URLSearchParams();

    params.set('taskKey', task.key ?? task.id);

    if (task.branch_name) {
      params.set('branch', task.branch_name);
    }

    if (task.estimated_minutes) {
      params.set('estimatedMinutes', String(task.estimated_minutes));
    }

    return this.http.get<GitEvidenceSyncResponse>(
      `${this.proxyUrl}/sync-gitlab?${params.toString()}`,
    );
  }

  getAssignedTasks(): Observable<ExternalTaskSourceItem[]> {
    return this.http.get<ExternalTaskSourceItem[]>(`${this.proxyUrl}/jira/mock-tasks`);
  }
  syncCommits(task: ExternalTaskSourceItem): Observable<GitEvidenceSyncResponse> {
    return this.syncEvidence(task);
  }

  getJiraTasks(): Observable<ExternalTaskSourceItem[]> {
    return this.getAssignedTasks();
  }
}
