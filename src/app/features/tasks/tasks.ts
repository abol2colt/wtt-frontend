import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';
import { ApiState } from '../../shared/models/api-state.model';
import { TaskItem, TaskListResponse } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';
import { TasksService } from './services/tasks.service';

type TaskRangeFilter = 'month_till_today' | 'today' | 'week_till_today';
type TaskStatusFilter = 'all' | 'pending' | 'rejected';
@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  layout = inject(LayoutService);
  private readonly tasksService = inject(TasksService);

  tasksState = signal<ApiState<TaskListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  currentPage = signal(1);
  activeRange = signal<TaskRangeFilter>('month_till_today');
  activeStatus = signal<TaskStatusFilter>('all');

  private readonly userId = environment.temporaryUserId;

  constructor() {
    this.layout.isTasksPage.set(true);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(page = this.currentPage()): void {
    this.currentPage.set(page);

    this.tasksState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getTasks(this.userId, page, this.activeRange()).subscribe({
      next: (response) => {
        this.tasksState.set({
          data: response,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.tasksState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت لیست وظایف',
        });
      },
    });
  }

  get allTasks(): TaskItem[] {
    return this.tasksState().data?.data ?? [];
  }

  get tasks(): TaskItem[] {
    const status = this.activeStatus();

    if (status === 'all') {
      return this.allTasks;
    }

    return this.allTasks.filter((task) => task.status === status);
  }

  get totalTasks(): number {
    return this.tasksState().data?.meta.total ?? 0;
  }

  get totalDuration(): number {
    return this.tasks.reduce((sum, task) => sum + task.duration, 0);
  }

  get pendingCount(): number {
    return this.tasks.filter((task) => task.status === 'pending').length;
  }

  get rejectedCount(): number {
    return this.tasks.filter((task) => task.status === 'rejected').length;
  }

  get pageSize(): number {
    return this.tasksState().data?.meta.page_size ?? 10;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalTasks / this.pageSize));
  }

  get hasPreviousPage(): boolean {
    return this.currentPage() > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage() < this.totalPages;
  }

  goToPreviousPage(): void {
    if (!this.hasPreviousPage) return;

    this.loadTasks(this.currentPage() - 1);
  }

  goToNextPage(): void {
    if (!this.hasNextPage) return;

    this.loadTasks(this.currentPage() + 1);
  }

  resetFilters(): void {
    this.activeRange.set('month_till_today');
    this.activeStatus.set('all');
    this.loadTasks(1);
  }

  setRangeFilter(range: TaskRangeFilter): void {
    this.activeRange.set(range);
    this.activeStatus.set('all');
    this.loadTasks(1);
  }

  setStatusFilter(status: TaskStatusFilter): void {
    this.activeStatus.set(status);
    this.loadTasks(1);
  }

  isAllFilterActive(): boolean {
    return this.activeRange() === 'month_till_today' && this.activeStatus() === 'all';
  }

  isRangeFilterActive(range: TaskRangeFilter): boolean {
    return this.activeRange() === range && this.activeStatus() === 'all';
  }

  isStatusFilterActive(status: TaskStatusFilter): boolean {
    return this.activeStatus() === status;
  }

  formatMinutes(minutes: number | null | undefined): string {
    if (minutes == null || minutes <= 0) return '00:00';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(mins).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  }
  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'pending':
        return 'در انتظار تایید';
      case 'rejected':
        return 'نیازمند اصلاح';
      case 'draft':
        return 'پیش‌نویس';
      case 'edited':
        return 'ویرایش شده';
      default:
        return status;
    }
  }
  getStatusRailClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'done';
      case 'pending':
        return 'review';
      case 'rejected':
        return 'review';
      case 'edited':
        return 'progress';
      case 'draft':
        return 'progress';
      default:
        return 'progress';
    }
  }

  getStatusTextClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'text-emerald-500';
      case 'pending':
        return 'text-orange-500';
      case 'rejected':
        return 'text-red-500';
      case 'edited':
        return 'text-blue-500';
      case 'draft':
        return 'text-slate-500';
      default:
        return 'text-[var(--text-soft)]';
    }
  }

  trackTask(index: number, task: TaskItem): number {
    return task.id;
  }
}
