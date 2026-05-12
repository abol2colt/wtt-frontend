import { Component, OnInit, effect, inject, signal, untracked } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from '../../core/services/layout/layout.service';
import { ApiState } from '../../shared/models/api-state.model';
import {
  TaskItem,
  TaskListQuery,
  TaskListResponse,
  TaskMutationPayload,
  TasksCountResponse,
  TaskRange,
} from '../../shared/models/task.model';
import { TasksService } from './services/tasks.service';
import { TasksFiltersService } from './services/tasks-filters.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Project, ProjectDetailsResponse } from '../../shared/models/project.model';

type TaskRangeFilter =
  | 'month_till_today'
  | 'today'
  | 'yesterday'
  | 'week'
  | 'last_week'
  | 'this_year';
type TaskStatusFilter = 'all' | 'pending' | 'rejected';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  layout = inject(LayoutService);
  private readonly tasksService = inject(TasksService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly taskFilters = inject(TasksFiltersService);

  private filtersEffectReady = false;
  readonly Number = Number;

  tasksState = signal<ApiState<TaskListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  mutationState = signal<ApiState<null>>({
    data: null,
    loading: false,
    error: null,
  });

  projectsState = signal<ApiState<Project[]>>({
    data: null,
    loading: false,
    error: null,
  });

  projectDetailsState = signal<ApiState<ProjectDetailsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  tasksCountState = signal<ApiState<TasksCountResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  isTaskModalOpen = signal(false);
  editingTask = signal<TaskItem | null>(null);

  currentPage = signal(1);
  activeRange = signal<TaskRangeFilter>('month_till_today');
  activeStatus = signal<TaskStatusFilter>('all');
  deletingTaskId = signal<number | null>(null);
  deleteError = signal<string | null>(null);
  selectedProjectId = signal<number | null>(null);
  selectedServiceId = signal<number | null>(null);
  selectedContractId = signal<number | null>(null);

  teleworkingOnly = signal(false);
  favoriteOnly = signal(false);

  startDate = signal('');
  endDate = signal('');
  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    project: [0, [Validators.required, Validators.min(1)]],
    project_service: [0, [Validators.required, Validators.min(1)]],
    project_contract: [0, [Validators.required, Validators.min(1)]],
    location: ['teleworking', Validators.required],
    date: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    description: [''],
  });

  constructor() {
    this.layout.isTasksPage.set(true);

    effect(() => {
      this.taskFilters.reloadKey();

      if (!this.filtersEffectReady) {
        this.filtersEffectReady = true;
        return;
      }

      untracked(() => {
        this.currentPage.set(1);
        this.loadTasks(1);
        this.loadTasksCount();
      });
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadTasksCount();
    this.loadProjects();
  }

  loadTasksCount(): void {
    this.tasksCountState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getTasksCount(this.buildCurrentTaskQuery()).subscribe({
      next: (response) => {
        this.tasksCountState.set({
          data: response,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.tasksCountState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت شمارنده وظایف',
        });
      },
    });
  }

  loadTasks(page = this.currentPage()): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.tasksState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد. لطفاً دوباره وارد شوید.',
      });

      return;
    }

    this.currentPage.set(page);

    this.tasksState.set({
      data: null,
      loading: true,
      error: null,
    });
    this.tasksService.getTasks(userId, this.taskFilters.buildQuery(page)).subscribe({
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
    return this.listTotalTasks;
  }

  get totalDuration(): number {
    return this.tasks.reduce((sum, task) => sum + task.duration, 0);
  }

  get pendingCount(): number {
    return this.tasksCountState().data?.pending ?? 0;
  }

  get rejectedCount(): number {
    return this.tasksCountState().data?.reject ?? 0;
  }

  get approvedCount(): number {
    return this.tasksCountState().data?.accept ?? 0;
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

  get listTotalTasks(): number {
    return this.tasksState().data?.meta.total ?? 0;
  }

  get acceptedCount(): number {
    return this.tasksCountState().data?.accept ?? 0;
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

  setRangeFilter(range: TaskRangeFilter): void {
    this.taskFilters.setQuickRange(range);
  }

  resetFilters(): void {
    this.taskFilters.reset();
  }

  setStatusFilter(status: 'all' | 'approved' | 'pending' | 'rejected'): void {
    this.taskFilters.activeStatus.set(status);
  }

  isAllFilterActive(): boolean {
    return this.activeRange() === 'month_till_today' && this.activeStatus() === 'all';
  }

  isRangeFilterActive(range: TaskRange): boolean {
    return this.taskFilters.activeRange() === range && this.taskFilters.activeStatus() === 'all';
  }

  isStatusFilterActive(status: 'all' | 'approved' | 'pending' | 'rejected'): boolean {
    return this.taskFilters.activeStatus() === status;
  }

  loadProjects(): void {
    this.projectsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getProjects().subscribe({
      next: (projects) => {
        this.projectsState.set({
          data: projects,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.projectsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت لیست پروژه‌ها',
        });
      },
    });
  }
  loadProjectDetails(projectId: number): void {
    if (!projectId || projectId <= 0) {
      this.projectDetailsState.set({
        data: null,
        loading: false,
        error: null,
      });

      this.taskForm.patchValue({
        project_service: 0,
        project_contract: 0,
      });

      return;
    }

    this.projectDetailsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getProjectDetails(projectId).subscribe({
      next: (details) => {
        this.projectDetailsState.set({
          data: details,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.projectDetailsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت سرویس‌ها و قراردادهای پروژه',
        });
      },
    });
    this.taskForm.patchValue({
      project_service: 0,
      project_contract: 0,
    });
  }
  onProjectChange(projectId: number | string): void {
    const selectedProjectId = Number(projectId);

    this.taskForm.patchValue({
      project_service: 0,
      project_contract: 0,
    });

    this.loadProjectDetails(selectedProjectId);
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
  openCreateTaskModal(): void {
    this.editingTask.set(null);

    this.taskForm.reset({
      title: '',
      project: 0,
      project_service: 0,
      project_contract: 0,
      location: 'teleworking',
      date: '',
      start_time: '',
      end_time: '',
      description: '',
    });

    this.mutationState.set({
      data: null,
      loading: false,
      error: null,
    });

    this.isTaskModalOpen.set(true);
  }
  openEditTaskModal(task: TaskItem): void {
    this.editingTask.set(task);

    this.taskForm.reset({
      title: task.title,
      project: task.project_id,
      project_service: 0,
      project_contract: 0,
      location: task.location ?? 'teleworking',
      date: task.date,
      start_time: this.extractTime(task.start_time),
      end_time: this.extractTime(task.end_time),
      description: '',
    });
    this.loadProjectDetails(task.project_id);
    this.mutationState.set({
      data: null,
      loading: false,
      error: null,
    });

    this.isTaskModalOpen.set(true);
  }
  private extractTime(dateTime: string | undefined): string {
    if (!dateTime) return '';

    const timePart = dateTime.split(' ')[1];

    if (!timePart) return '';

    return timePart.slice(0, 5);
  }
  closeTaskModal(): void {
    if (this.mutationState().loading) return;

    this.isTaskModalOpen.set(false);
    this.editingTask.set(null);
  }

  private calculateDurationMinutes(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    return Math.max(0, endTotal - startTotal);
  }

  private buildTaskPayload(): TaskMutationPayload {
    const formValue = this.taskForm.getRawValue();

    const duration = this.calculateDurationMinutes(formValue.start_time, formValue.end_time);

    return {
      title: formValue.title,
      project: formValue.project,
      project_service: formValue.project_service,
      project_contract: formValue.project_contract,
      location: formValue.location,
      date: formValue.date,
      start_time: `${formValue.date} ${formValue.start_time}:00`,
      end_time: `${formValue.date} ${formValue.end_time}:00`,
      duration,
      description: formValue.description || undefined,
    };
  }

  deleteTask(task: TaskItem): void {
    const confirmed = window.confirm(`آیا از حذف این وظیفه مطمئنی؟\n${task.title}`);

    if (!confirmed) return;

    this.deletingTaskId.set(task.id);
    this.deleteError.set(null);

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        this.deletingTaskId.set(null);
        this.loadTasks(this.currentPage());
      },

      error: () => {
        this.deletingTaskId.set(null);
        this.deleteError.set('خطا در حذف وظیفه');
      },
    });
  }
  submitTaskForm(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();

      this.mutationState.set({
        data: null,
        loading: false,
        error: 'لطفاً فیلدهای ضروری را کامل وارد کن.',
      });

      return;
    }

    const payload = this.buildTaskPayload();

    if (payload.duration <= 0) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'ساعت پایان باید بعد از ساعت شروع باشد.',
      });

      return;
    }

    this.mutationState.set({
      data: null,
      loading: true,
      error: null,
    });

    const editingTask = this.editingTask();

    const request$ = editingTask
      ? this.tasksService.updateTask(editingTask.id, payload)
      : this.tasksService.createTask(payload);

    request$.subscribe({
      next: () => {
        this.mutationState.set({
          data: null,
          loading: false,
          error: null,
        });

        this.closeTaskModal();
        this.loadTasks(this.currentPage());
      },

      error: () => {
        this.mutationState.set({
          data: null,
          loading: false,
          error: editingTask ? 'خطا در ویرایش وظیفه' : 'خطا در ثبت وظیفه',
        });
      },
    });
  }
  applyAdvancedFilters(): void {
    this.activeStatus.set('all');
    this.loadTasks(1);
    this.loadTasksCount();
  }

  resetAdvancedFilters(): void {
    this.selectedProjectId.set(null);
    this.selectedServiceId.set(null);
    this.selectedContractId.set(null);
    this.teleworkingOnly.set(false);
    this.favoriteOnly.set(false);
    this.startDate.set('');
    this.endDate.set('');

    this.activeRange.set('month_till_today');
    this.activeStatus.set('all');

    this.projectDetailsState.set({
      data: null,
      loading: false,
      error: null,
    });

    this.loadTasks(1);
    this.loadTasksCount();
  }
  onFilterProjectChange(projectId: number | string): void {
    const selectedProjectId = Number(projectId) || null;

    this.selectedProjectId.set(selectedProjectId);
    this.selectedServiceId.set(null);
    this.selectedContractId.set(null);

    if (selectedProjectId) {
      this.loadProjectDetails(selectedProjectId);
    } else {
      this.projectDetailsState.set({
        data: null,
        loading: false,
        error: null,
      });
    }
  }
  private buildCurrentTaskQuery(page = this.currentPage()): TaskListQuery {
    const query: TaskListQuery = {
      page,
      range: this.activeRange(),
    };

    if (this.startDate() && this.endDate()) {
      query.start_date = this.startDate();
      query.end_date = this.endDate();
      delete query.range;
    }

    if (this.selectedProjectId()) {
      query.project = this.selectedProjectId()!;
    }

    if (this.selectedServiceId()) {
      query.project_service = this.selectedServiceId()!;
    }

    if (this.selectedContractId()) {
      query.project_contract = this.selectedContractId()!;
    }

    if (this.teleworkingOnly()) {
      query.teleworking = true;
    }

    if (this.favoriteOnly()) {
      query.favorite = true;
    }

    return query;
  }
}
