import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ExternalTaskSourceItem, GitEvidenceSyncResponse } from '../../../shared/models/task.model';
import { catchError, throwError, Observable } from 'rxjs';

export type AiPromptOptions = {
  tone: 'formal' | 'technical' | 'managerial';
  detailLevel: 'short' | 'balanced' | 'detailed';
  extraInstruction?: string;
};

@Injectable({ providedIn: 'root' })
export class GitlabSyncService {
  private readonly http = inject(HttpClient);
  private readonly proxyUrl = environment.integrationProxyBaseUrl.replace(/\/$/, '');
  private normalizeIntegrationError(error: unknown, fallbackMessage: string): Error {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return new Error('Integration proxy در دسترس نیست. اول wtt-proxy را اجرا کن.');
      }

      const backendMessage = error.error?.error || error.error?.message || error.error?.description;

      return new Error(backendMessage || fallbackMessage);
    }

    return new Error(fallbackMessage);
  }
  syncEvidence(
    task: ExternalTaskSourceItem,
    options?: AiPromptOptions,
  ): Observable<GitEvidenceSyncResponse> {
    const params: Record<string, string> = {
      taskKey: String(task.key ?? task.id),
    };

    if (task.branch_name) {
      params['branch'] = task.branch_name;
    }

    if (task.estimated_minutes) {
      params['estimatedMinutes'] = String(task.estimated_minutes);
    }

    if (options?.tone) {
      params['tone'] = options.tone;
    }

    if (options?.detailLevel) {
      params['detailLevel'] = options.detailLevel;
    }

    if (options?.extraInstruction) {
      params['extraInstruction'] = options.extraInstruction;
    }

    return this.http
      .get<GitEvidenceSyncResponse>(`${this.proxyUrl}/sync-gitlab`, {
        params,
      })
      .pipe(
        catchError((error) =>
          throwError(() =>
            this.normalizeIntegrationError(error, 'خطا در تولید گزارش از شواهد Git.'),
          ),
        ),
      );
  }

  getAssignedTasks(): Observable<ExternalTaskSourceItem[]> {
    return this.http
      .get<ExternalTaskSourceItem[]>(`${this.proxyUrl}/jira/assigned-tasks`)
      .pipe(
        catchError((error) =>
          throwError(() =>
            this.normalizeIntegrationError(
              error,
              'خطا در دریافت تسک‌های انتسابی از integration proxy.',
            ),
          ),
        ),
      );
  }
  syncCommits(task: ExternalTaskSourceItem): Observable<GitEvidenceSyncResponse> {
    return this.syncEvidence(task);
  }

  getJiraTasks(): Observable<ExternalTaskSourceItem[]> {
    return this.getAssignedTasks();
  }
}
