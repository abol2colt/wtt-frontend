import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from '../../core/services/layout/layout.service';
import { ApiState } from '../../shared/models/api-state.model';
import { TaskItem, TaskListResponse, TaskMutationPayload } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';
import { TasksService } from './services/tasks.service';
import { Project, ProjectDetailsResponse } from '../../shared/models/project.model';

type TaskRangeFilter = 'month_till_today' | 'today' | 'week_till_today';
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
  private readonly fb = inject(FormBuilder);

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

  isTaskModalOpen = signal(false);
  editingTask = signal<TaskItem | null>(null);

  currentPage = signal(1);
  activeRange = signal<TaskRangeFilter>('month_till_today');
  activeStatus = signal<TaskStatusFilter>('all');
  deletingTaskId = signal<number | null>(null);
  deleteError = signal<string | null>(null);

  private readonly userId = environment.temporaryUserId;

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
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadProjects();
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
}
