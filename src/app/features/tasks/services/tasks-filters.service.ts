import { Injectable, signal } from '@angular/core';
import { TaskListQuery, TaskRange } from '../../../shared/models/task.model';

export type TaskUiStatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

@Injectable({
  providedIn: 'root',
})
export class TasksFiltersService {
  activeRange = signal<TaskRange>('month_till_today');
  activeStatus = signal<TaskUiStatusFilter>('all');

  selectedProjectId = signal<number | null>(null);
  selectedServiceId = signal<number | null>(null);
  selectedContractId = signal<number | null>(null);

  teleworkingOnly = signal(false);
  favoriteOnly = signal(false);

  startDate = signal('');
  endDate = signal('');

  reloadKey = signal(0);

  setQuickRange(range: TaskRange): void {
    this.activeRange.set(range);
    this.activeStatus.set('all');
    this.startDate.set('');
    this.endDate.set('');
    this.apply();
  }

  apply(): void {
    this.reloadKey.update((value) => value + 1);
  }

  reset(): void {
    this.activeRange.set('month_till_today');
    this.activeStatus.set('all');

    this.selectedProjectId.set(null);
    this.selectedServiceId.set(null);
    this.selectedContractId.set(null);

    this.teleworkingOnly.set(false);
    this.favoriteOnly.set(false);

    this.startDate.set('');
    this.endDate.set('');

    this.apply();
  }

  buildQuery(page = 1): TaskListQuery {
    const query: TaskListQuery = { page };

    const startDate = this.startDate().trim();
    const endDate = this.endDate().trim();

    if (startDate && endDate) {
      query.start_date = startDate;
      query.end_date = endDate;
    } else {
      query.range = this.activeRange();
    }

    if (this.selectedProjectId()) query.project = this.selectedProjectId()!;
    if (this.selectedServiceId()) query.project_service = this.selectedServiceId()!;
    if (this.selectedContractId()) query.project_contract = this.selectedContractId()!;

    if (this.teleworkingOnly()) query.teleworking = true;
    if (this.favoriteOnly()) query.favorite = true;

    return query;
  }
}
