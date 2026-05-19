import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import {
  ReportRange,
  ReportResponse,
  ReportRow,
  ReportStatus,
  ReportSummary,
} from '../../../shared/models/report.model';
import { TaskItem } from '../../../shared/models/task.model';
import { TasksService } from '../../tasks/services/tasks.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly tasksService = inject(TasksService);

  getReport(userId: number, range: ReportRange): Observable<ReportResponse> {
    return this.loadTaskPages(userId, range).pipe(
      map((tasks) => {
        const rows = tasks.map((task) => this.mapTaskToReportRow(task));

        return {
          range,
          rows,
          summary: this.buildSummary(rows),
        };
      }),
    );
  }

  private loadTaskPages(
    userId: number,
    range: ReportRange,
    page = 1,
    collectedTasks: TaskItem[] = [],
  ): Observable<TaskItem[]> {
    return this.tasksService.getTasks(userId, { range, page }).pipe(
      switchMap((response) => {
        const nextTasks = [...collectedTasks, ...response.data];
        const totalTasks = response.meta.total ?? nextTasks.length;
        const hasMorePages = response.data.length > 0 && nextTasks.length < totalTasks;

        if (!hasMorePages) {
          return of(nextTasks);
        }

        return this.loadTaskPages(userId, range, page + 1, nextTasks);
      }),
    );
  }

  private mapTaskToReportRow(task: TaskItem): ReportRow {
    const durationMinutes = Number(task.duration) || 0;

    return {
      id: task.id,
      date: task.date,
      title: task.title,
      project: task.project_title || 'بدون پروژه',
      durationMinutes,
      durationLabel: this.formatDuration(durationMinutes),
      status: this.normalizeStatus(task.status),
    };
  }

  private buildSummary(rows: ReportRow[]): ReportSummary {
    const totalDurationMinutes = rows.reduce((sum, row) => sum + row.durationMinutes, 0);

    return {
      totalDurationMinutes,
      totalDurationLabel: this.formatDuration(totalDurationMinutes),
      totalTaskCount: rows.length,
      approvedCount: rows.filter((row) => row.status === 'approved').length,
      rejectedCount: rows.filter((row) => row.status === 'rejected').length,
    };
  }

  private normalizeStatus(status: string): ReportStatus {
    switch (status) {
      case 'approved':
      case 'accept':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'rejected':
      case 'reject':
        return 'rejected';
      case 'draft':
        return 'draft';
      case 'edited':
        return 'edited';
      default:
        return 'unknown';
    }
  }

  private formatDuration(minutes: number): string {
    const safeMinutes = Math.max(0, Math.floor(minutes));
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}د`;
    }

    if (remainingMinutes === 0) {
      return `${hours}س`;
    }

    return `${hours}س ${remainingMinutes}د`;
  }
}
