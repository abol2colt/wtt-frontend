import {
  Component,
  HostListener,
  OnInit,
  effect,
  inject,
  signal,
  untracked,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutService } from '../../core/services/layout/layout.service';
import { GitlabSyncService } from './services/gitlab-sync.service';
import { environment } from '../../../environments/environment';
import { ApiState } from '../../shared/models/api-state.model';
import { format } from 'date-fns-jalali';
import {
  TaskItem,
  TaskListResponse,
  TaskMutationPayload,
  TasksCountResponse,
  TaskRange,
  ExternalTaskSourceItem,
  GitEvidenceCommit,
  GitEvidenceSyncResponse,
} from '../../shared/models/task.model';
import { TasksService } from './services/tasks.service';
import { TasksFiltersService } from './services/tasks-filters.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Project, ProjectDetailsResponse } from '../../shared/models/project.model';
import { formatDurationAsHHMM } from '../../shared/utils/time-format';
import { getTaskStatusMeta } from './utils/task-status-meta';
import {
  AiDetailLevel,
  AiTone,
  ProjectDetailsPreselect,
  TaskStatusFilter,
  TaskViewMode,
  WorklogFlowType,
} from './models/tasks-page.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements OnInit {
  layout = inject(LayoutService);
  private readonly tasksService = inject(TasksService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly testTaskPrefix = environment.taskMutationTestPrefix;
  readonly taskFilters = inject(TasksFiltersService);
  private getTodayJalaliDate(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

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

  taskViewMode = signal<TaskViewMode>('list');
  isTaskModalOpen = signal(false);
  isDrawerOpen = signal(false);
  currentStep = signal(1);
  private readonly gitlabSyncService = inject(GitlabSyncService);

  isSyncing = signal(false);
  editingTask = signal<TaskItem | null>(null);
  aiConfidenceScore = signal<number | null>(null);
  aiEvidenceSummary = signal('');

  manualGitCommits = signal<GitEvidenceCommit[]>([]);
  manualEvidenceTitle = signal('');

  readonly maxAllowedAdjustmentMinutes = 30;
  suggestedWorklogDurationMinutes = signal<number | null>(null);
  private lastEditTrigger: HTMLElement | null = null;

  currentPage = signal(1);
  activeRange = signal<TaskRange>('month_till_today');
  activeStatus = signal<TaskStatusFilter>('all');
  deletingTaskId = signal<number | null>(null);
  deleteError = signal<string | null>(null);
  selectedProjectId = signal<number | null>(null);
  selectedServiceId = signal<number | null>(null);
  selectedContractId = signal<number | null>(null);

  teleworkingOnly = signal(false);
  favoriteOnly = signal(false);

  recentGitCommits = signal<GitEvidenceCommit[]>([]);
  selectedRecentCommitIds = signal<string[]>([]);
  aiFallbackMessage = signal('');
  matchedGitCommits = signal<GitEvidenceCommit[]>([]);
  isRecentEvidenceOpen = signal(false);

  startDate = signal('');
  endDate = signal('');
  jiraTasks = signal<ExternalTaskSourceItem[]>([]);
  selectedJiraTask = signal<ExternalTaskSourceItem | null>(null);
  manualTaskKey = signal('');
  manualTaskTitle = signal('');

  showJiraDropdown = signal(false);
  flowType = signal<WorklogFlowType | null>(null);
  aiTone = signal<AiTone>('formal');
  aiDetailLevel = signal<AiDetailLevel>('balanced');
  aiExtraInstruction = signal('');

  readonly jalaliMonthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  datePickerYear = signal(this.getInitialJalaliYearMonth().year);
  datePickerMonth = signal(this.getInitialJalaliYearMonth().month);

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
    adjustment_reason: [''],
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

    this.tasksService.getTasksCount(this.taskFilters.buildQuery(this.currentPage())).subscribe({
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

  setRangeFilter(range: TaskRange): void {
    this.taskFilters.setQuickRange(range);
  }

  resetFilters(): void {
    this.taskFilters.reset();
  }

  setStatusFilter(status: 'all' | 'approved' | 'pending' | 'rejected'): void {
    this.taskFilters.activeStatus.set(status);
  }

  setTaskViewMode(mode: TaskViewMode): void {
    this.taskViewMode.set(mode);
  }

  isTaskViewMode(mode: TaskViewMode): boolean {
    return this.taskViewMode() === mode;
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

  loadProjectDetails(projectId: number, preselect?: ProjectDetailsPreselect): void {
    if (!projectId || projectId <= 0) {
      this.projectDetailsState.set({ data: null, loading: false, error: null });
      return;
    }

    this.projectDetailsState.set({ data: null, loading: true, error: null });
    this.tasksService.getProjectDetails(projectId).subscribe({
      next: (details) => {
        this.projectDetailsState.set({
          data: details,
          loading: false,
          error: null,
        });

        if (!preselect) return;

        const serviceId = details.services.some((s) => s.id === preselect.serviceId)
          ? preselect.serviceId
          : details.services[0]?.id || 0;

        const contractId = details.contracts.some((c) => c.id === preselect.contractId)
          ? preselect.contractId
          : details.contracts[0]?.id || 0;

        this.taskForm.patchValue({
          project_service: serviceId,
          project_contract: contractId,
        });
      },
      error: () =>
        this.projectDetailsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت جزئیات',
        }),
    });
  }

  onProjectChange(projectId: number | string): void {
    const id = Number(projectId);
    this.taskForm.patchValue({ project_service: 0, project_contract: 0 });
    this.loadProjectDetails(id);
  }
  formatMinutes(minutes: number | null | undefined): string {
    return formatDurationAsHHMM(minutes);
  }
  getStatusLabel(status: string): string {
    return getTaskStatusMeta(status).label;
  }

  getStatusRailClass(status: string): string {
    return getTaskStatusMeta(status).railClass;
  }

  getStatusTextClass(status: string): string {
    return getTaskStatusMeta(status).textClass;
  }

  getStatusBadgeClass(status: string): string {
    return getTaskStatusMeta(status).badgeClass;
  }

  trackTask(index: number, task: TaskItem): number {
    return task.id;
  }
  openCreateTaskModal(): void {
    this.editingTask.set(null);
    this.suggestedWorklogDurationMinutes.set(null);
    this.currentStep.set(1);
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('');
    this.manualTaskKey.set('');
    this.manualTaskTitle.set('');
    this.selectedJiraTask.set(null);
    this.showJiraDropdown.set(false);
    this.flowType.set(null);
    this.aiTone.set('formal');
    this.aiDetailLevel.set('balanced');
    this.aiExtraInstruction.set('');
    this.resetDatePickerToToday();

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
      adjustment_reason: '',
    });

    this.mutationState.set({
      data: null,
      loading: false,
      error: null,
    });
    this.manualGitCommits.set([]);
    this.manualEvidenceTitle.set('');
    this.isTaskModalOpen.set(true);
    this.loadJiraTasks();
  }
  addManualGitEvidence(): void {
    const title = this.manualEvidenceTitle().trim();

    if (!title) return;

    const manualCommit: GitEvidenceCommit = {
      id: `manual-${Date.now()}`,
      shortId: 'manual',
      title,
      message: title,
      authorName: 'manual',
      createdAt: new Date().toISOString(),
      webUrl: '',
      source: 'manual' as GitEvidenceCommit['source'],
      ref: null,
      commitCount: 1,
    };

    this.manualGitCommits.update((commits) => [manualCommit, ...commits]);
    this.selectedRecentCommitIds.update((ids) => [manualCommit.id, ...ids]);
    this.manualEvidenceTitle.set('');
  }

  removeManualGitEvidence(commitId: string): void {
    this.manualGitCommits.update((commits) => commits.filter((commit) => commit.id !== commitId));
    this.selectedRecentCommitIds.update((ids) => ids.filter((id) => id !== commitId));
  }
  openEditTaskModal(task: TaskItem, event?: Event): void {
    this.lastEditTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.editingTask.set(task);
    this.suggestedWorklogDurationMinutes.set(null);
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('');
    this.selectedJiraTask.set(null);
    this.showJiraDropdown.set(false);
    this.flowType.set(null);

    this.taskForm.reset({
      title: task.title,
      project: task.project_id,
      project_service: 0,
      project_contract: 0,
      location: task.location ?? 'teleworking',
      date: task.date,
      start_time: this.extractTime(task.start_time),
      end_time: this.extractTime(task.end_time),
      description: task.description ?? '',
      adjustment_reason: '',
    });
    this.loadProjectDetails(task.project_id);
    this.mutationState.set({
      data: null,
      loading: false,
      error: null,
    });

    this.isDrawerOpen.set(true);
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
    this.isDrawerOpen.set(false);
    this.editingTask.set(null);
    this.currentStep.set(1);
    this.showJiraDropdown.set(false);
    this.resetTaskForm();
    queueMicrotask(() => {
      this.lastEditTrigger?.focus();
      this.lastEditTrigger = null;
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isTaskModalOpen() || this.isDrawerOpen()) {
      this.closeTaskModal();
    }
  }

  private resetTaskForm(): void {
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
      adjustment_reason: '',
    });
    this.recentGitCommits.set([]);
    this.selectedRecentCommitIds.set([]);
    this.matchedGitCommits.set([]);
    this.aiFallbackMessage.set('');
    this.manualTaskKey.set('');
    this.manualTaskTitle.set('');
    this.suggestedWorklogDurationMinutes.set(null);
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('');
    this.selectedJiraTask.set(null);
    this.flowType.set(null);
    this.aiTone.set('formal');
    this.aiDetailLevel.set('balanced');
    this.aiExtraInstruction.set('');
    this.isRecentEvidenceOpen.set(false);
    this.resetDatePickerToToday();
  }

  goToWizardStep(step: number): void {
    if (step < 1 || step > 4) return;

    if (step === 2 && !this.isWizardStepOneValid()) return;

    if (step === 3 && (!this.isWizardStepOneValid() || !this.flowType())) return;

    if (step === 4) {
      if (this.flowType() === 'manual' && !this.isManualEntryReady()) return;
      if (this.flowType() === 'ai' && !this.taskForm.controls.description.value.trim()) return;
    }

    this.currentStep.set(step);
  }

  goToNextWizardStep(): void {
    if (this.currentStep() === 1) {
      if (!this.isJiraTaskSelected()) {
        this.mutationState.set({
          data: null,
          loading: false,
          error: 'برای ادامه، اول یک تسک از جیرا انتخاب کن.',
        });
        return;
      }

      if (!this.isWizardStepOneValid()) {
        this.mutationState.set({
          data: null,
          loading: false,
          error: 'عنوان تسک از Jira آماده نشد. یک تسک معتبر انتخاب کن.',
        });
        return;
      }
    }

    if (this.currentStep() === 2 && !this.flowType()) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'لطفاً مسیر ثبت کارکرد را انتخاب کن.',
      });
      return;
    }

    if (this.currentStep() === 2 && this.flowType() === 'ai') {
      this.startAiFlow();
      return;
    }

    if (this.currentStep() === 3 && this.flowType() === 'manual') {
      if (!this.isManualEntryReady()) {
        this.taskForm.markAllAsTouched();
        this.mutationState.set({
          data: null,
          loading: false,
          error: 'تاریخ، ساعت شروع، ساعت پایان و توضیحات را کامل کن.',
        });
        return;
      }

      this.currentStep.set(4);
      this.mutationState.set({ data: null, loading: false, error: null });
      return;
    }

    this.mutationState.set({ data: null, loading: false, error: null });
    this.currentStep.set(Math.min(4, this.currentStep() + 1));
  }

  goToPreviousWizardStep(): void {
    if (this.currentStep() === 4) {
      this.currentStep.set(3);
      return;
    }

    this.currentStep.set(Math.max(1, this.currentStep() - 1));
  }
  isWizardStepComplete(step: number): boolean {
    if (step === 1) return this.isWizardStepOneValid();
    if (step === 2) return Boolean(this.flowType());
    if (step === 3) {
      if (this.flowType() === 'manual') return this.isManualEntryReady();
      if (this.flowType() === 'ai') return Boolean(this.taskForm.controls.description.value.trim());
    }

    return false;
  }

  isWizardStepDisabled(step: number): boolean {
    if (step <= this.currentStep()) return false;

    if (step === 2) return !this.isWizardStepOneValid();

    if (step === 3) {
      return !this.isWizardStepOneValid() || !this.flowType();
    }

    if (step === 4) {
      if (this.flowType() === 'manual') return !this.isManualEntryReady();
      if (this.flowType() === 'ai') return !this.taskForm.controls.description.value.trim();
      return true;
    }

    return true;
  }

  isWizardStepOneValid(): boolean {
    const controls = this.taskForm.controls;

    return this.isJiraTaskSelected() && controls.title.valid && controls.location.valid;
  }
  isJiraTaskSelected(): boolean {
    return Boolean(this.selectedJiraTask());
  }

  isWttMappingReady(): boolean {
    const controls = this.taskForm.controls;

    return (
      controls.project.valid &&
      controls.project_service.valid &&
      controls.project_contract.valid &&
      controls.location.valid
    );
  }

  isManualEntryReady(): boolean {
    const controls = this.taskForm.controls;
    const description = controls.description.value.trim();

    return (
      this.isWizardStepOneValid() &&
      controls.date.valid &&
      controls.start_time.valid &&
      controls.end_time.valid &&
      this.getCurrentDurationMinutes() > 0 &&
      description.length > 0 &&
      (!this.requiresAdjustmentReason() || Boolean(controls.adjustment_reason.value.trim()))
    );
  }

  private markWizardStepOneTouched(): void {
    const controls = this.taskForm.controls;
    controls.title.markAsTouched();
    controls.project.markAsTouched();
    controls.project_service.markAsTouched();
    controls.project_contract.markAsTouched();
    controls.location.markAsTouched();
    controls.date.markAsTouched();
    controls.start_time.markAsTouched();
    controls.end_time.markAsTouched();
  }

  selectFlowType(type: WorklogFlowType): void {
    this.flowType.set(type);
    this.mutationState.set({ data: null, loading: false, error: null });

    if (type === 'manual') {
      this.aiConfidenceScore.set(null);
      this.aiEvidenceSummary.set('');
    }
  }

  startAiFlow(): void {
    if (!this.isWizardStepOneValid()) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'برای شروع AI، اول یک تسک معتبر از منبع وظایف انتخاب کن.',
      });
      return;
    }

    this.currentStep.set(3);
    this.taskForm.patchValue({
      date: this.taskForm.controls.date.value || this.getTodayJalaliDate(),
    });

    this.mutationState.set({ data: null, loading: false, error: null });
    this.onSyncGitlab();
  }

  private getInitialJalaliYearMonth(): { year: number; month: number } {
    const [year, month] = this.getTodayJalaliDate().split('-').map(Number);
    return { year, month };
  }

  private resetDatePickerToToday(): void {
    const { year, month } = this.getInitialJalaliYearMonth();
    this.datePickerYear.set(year);
    this.datePickerMonth.set(month);
  }

  moveDatePickerMonth(delta: number): void {
    let year = this.datePickerYear();
    let month = this.datePickerMonth() + delta;

    while (month < 1) {
      month += 12;
      year -= 1;
    }

    while (month > 12) {
      month -= 12;
      year += 1;
    }

    this.datePickerYear.set(year);
    this.datePickerMonth.set(month);
  }

  getJalaliMonthDays(): number[] {
    const month = this.datePickerMonth();
    const daysInMonth = month <= 6 ? 31 : month <= 11 ? 30 : 29;

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }

  selectJalaliDate(day: number): void {
    const month = String(this.datePickerMonth()).padStart(2, '0');
    const dayText = String(day).padStart(2, '0');

    this.taskForm.patchValue({
      date: `${this.datePickerYear()}-${month}-${dayText}`,
    });
    this.mutationState.set({ data: null, loading: false, error: null });
  }

  isSelectedJalaliDate(day: number): boolean {
    const month = String(this.datePickerMonth()).padStart(2, '0');
    const dayText = String(day).padStart(2, '0');

    return this.taskForm.controls.date.value === `${this.datePickerYear()}-${month}-${dayText}`;
  }

  getProjectTitleById(projectId: number): string {
    return (
      this.projectsState().data?.find((project) => project.id === Number(projectId))?.title ??
      `پروژه #${projectId || '-'}`
    );
  }

  getServiceTitleById(serviceId: number): string {
    return (
      this.projectDetailsState().data?.services.find((service) => service.id === Number(serviceId))
        ?.service ?? `سرویس #${serviceId || '-'}`
    );
  }

  getContractTitleById(contractId: number): string {
    return (
      this.projectDetailsState().data?.contracts.find(
        (contract) => contract.id === Number(contractId),
      )?.contract ?? `قرارداد #${contractId || '-'}`
    );
  }

  getLocationLabel(location: string): string {
    return location === 'incompany_working' ? 'حضوری' : 'دورکاری';
  }

  getCurrentDurationMinutes(): number {
    const { start_time, end_time } = this.taskForm.getRawValue();

    if (!start_time || !end_time) return 0;

    return this.calculateDurationMinutes(start_time, end_time);
  }

  applyAiTone(tone: 'formal' | 'shorter' | 'technical'): void {
    const currentDescription = this.taskForm.controls.description.value.trim();

    if (!currentDescription) return;

    const tonePrefix =
      tone === 'formal' ? 'با لحن رسمی‌تر:' : tone === 'shorter' ? 'خلاصه‌تر:' : 'با تاکید فنی:';

    this.taskForm.patchValue({
      description: `${tonePrefix}\n${currentDescription}`,
    });
  }

  private calculateDurationMinutes(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    return Math.max(0, endTotal - startTotal);
  }
  getManualAdjustmentMinutes(): number {
    const suggestedDuration = this.suggestedWorklogDurationMinutes();

    if (!suggestedDuration) return 0;

    const { start_time, end_time } = this.taskForm.getRawValue();

    if (!start_time || !end_time) return 0;

    const currentDuration = this.calculateDurationMinutes(start_time, end_time);

    return currentDuration - suggestedDuration;
  }

  requiresAdjustmentReason(): boolean {
    return this.getManualAdjustmentMinutes() > this.maxAllowedAdjustmentMinutes;
  }

  private buildTaskPayload(): TaskMutationPayload {
    const formValue = this.taskForm.getRawValue();

    const duration = this.calculateDurationMinutes(formValue.start_time, formValue.end_time);

    const adjustmentReason = formValue.adjustment_reason.trim();

    const finalDescription = adjustmentReason
      ? `${formValue.description || ''}

---
دلیل افزایش زمان:
${adjustmentReason}`
      : formValue.description;

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
      description: finalDescription || undefined,
    };
  }

  private isEmptyFormValue(value: unknown): boolean {
    return value === null || value === undefined || value === '' || value === 0;
  }

  private patchAiValueIfSafe(controlName: string, value: unknown): void {
    if (value === null || value === undefined || value === '') return;

    const control = this.taskForm.get(controlName);

    if (!control) return;

    const userChangedValue = control.dirty && !this.isEmptyFormValue(control.value);

    if (userChangedValue) {
      return;
    }

    control.patchValue(value);
  }

  private applyEvidenceDraftToForm(
    response: GitEvidenceSyncResponse,
    selectedTask: ExternalTaskSourceItem,
  ): void {
    const rawDurationMinutes = Number(
      response.suggestedDurationMinutes ??
        response.durationMinutes ??
        selectedTask.estimated_minutes ??
        60,
    );

    const durationMinutes = rawDurationMinutes > 0 ? rawDurationMinutes : 60;
    this.suggestedWorklogDurationMinutes.set(durationMinutes);

    const adjustmentReasonControl = this.taskForm.get('adjustment_reason');
    if (adjustmentReasonControl && !adjustmentReasonControl.dirty) {
      adjustmentReasonControl.patchValue('');
    }

    const now = new Date();

    const fallbackEndHour = String(now.getHours()).padStart(2, '0');
    const fallbackEndMinute = String(now.getMinutes()).padStart(2, '0');
    const fallbackEndTimeStr = `${fallbackEndHour}:${fallbackEndMinute}`;

    const fallbackStartTimeObj = new Date(now.getTime() - durationMinutes * 60000);
    const fallbackStartHour = String(fallbackStartTimeObj.getHours()).padStart(2, '0');
    const fallbackStartMinute = String(fallbackStartTimeObj.getMinutes()).padStart(2, '0');
    const fallbackStartTimeStr = `${fallbackStartHour}:${fallbackStartMinute}`;

    this.patchAiValueIfSafe('date', this.taskForm.controls.date.value || this.getTodayJalaliDate());
    this.patchAiValueIfSafe('start_time', response.suggestedStartTime || fallbackStartTimeStr);
    this.patchAiValueIfSafe('end_time', response.suggestedEndTime || fallbackEndTimeStr);

    const generatedDescription = (
      response.description ||
      response.fallbackDescription ||
      ''
    ).trim();

    if (generatedDescription) {
      this.patchAiValueIfSafe('description', generatedDescription);
      return;
    }

    this.mutationState.set({
      data: null,
      loading: false,
      error:
        'AI متن قابل استفاده‌ای برنگرداند. شواهد حفظ شده‌اند و می‌توانی توضیح را دستی وارد کنی.',
    });
  }

  deleteTask(task: TaskItem): void {
    if (environment.enableRealTaskMutation && !task.title.startsWith(this.testTaskPrefix)) {
      this.deleteError.set(
        `حذف واقعی فقط برای تسک‌های تستی با prefix ${this.testTaskPrefix} مجاز است.`,
      );
      return;
    }
    const confirmed = window.confirm(
      `این عملیات حذف واقعی WTT است و فقط برای تسک تستی مجاز است.\n\n${task.title}\n\nادامه می‌دهی؟`,
    );

    if (!confirmed) return;

    this.deletingTaskId.set(task.id);
    this.deleteError.set(null);

    this.tasksService.deleteTask(task.id, task.title).subscribe({
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
    if (this.isTaskModalOpen() && !this.editingTask() && this.currentStep() !== 4) {
      this.goToNextWizardStep();
      return;
    }

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
    if (environment.enableRealTaskMutation && !payload.title.startsWith(this.testTaskPrefix)) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: `برای تست mutation واقعی، عنوان باید با ${this.testTaskPrefix} شروع شود.`,
      });

      return;
    }

    if (this.requiresAdjustmentReason() && !this.taskForm.controls.adjustment_reason.value.trim()) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'برای افزایش زمان بیش از ۳۰ دقیقه نسبت به پیشنهاد سیستم، وارد کردن دلیل الزامی است.',
      });

      return;
    }

    this.mutationState.set({
      data: null,
      loading: true,
      error: null,
    });

    const editingTask = this.editingTask();
    let request$: ReturnType<TasksService['createTask']>;

    try {
      request$ = editingTask
        ? this.tasksService.updateTask(editingTask.id, payload)
        : this.tasksService.createTask(payload);
    } catch (error) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'خطا در آماده‌سازی درخواست ذخیره.',
      });
      return;
    }

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

      error: (error) => {
        const backendMessage =
          error?.status === 403
            ? 'دسترسی ثبت/ویرایش وظیفه برای این کاربر توسط WTT مجاز نیست. مسیر mutation تا backend تست شد و داده‌ای تغییر نکرد.'
            : error?.message || (editingTask ? 'خطا در ویرایش وظیفه' : 'خطا در ثبت وظیفه');

        this.mutationState.set({
          data: null,
          loading: false,
          error: backendMessage,
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

  toggleRecentEvidencePanel(): void {
    this.isRecentEvidenceOpen.update((isOpen) => !isOpen);
  }

  onSyncGitlab(): void {
    const selectedTask = this.selectedJiraTask();

    const selectedManualEvidenceIds = this.manualGitCommits()
      .map((commit) => commit.id)
      .filter((id) => this.selectedRecentCommitIds().includes(id));

    if (!selectedTask) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'اول یک تسک از منبع وظایف انتخاب کن تا شواهد Git دریافت شوند.',
      });
      return;
    }

    if (this.isSyncing()) return;

    this.isSyncing.set(true);
    this.matchedGitCommits.set([]);
    this.recentGitCommits.set([]);
    this.selectedRecentCommitIds.set(selectedManualEvidenceIds);
    this.aiFallbackMessage.set('');
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('');
    this.mutationState.set({ data: null, loading: false, error: null });
    this.isRecentEvidenceOpen.set(false);

    this.gitlabSyncService
      .getEvidenceCandidates(selectedTask, {
        tone: this.aiTone(),
        detailLevel: this.aiDetailLevel(),
        extraInstruction: this.aiExtraInstruction().trim(),
      })
      .subscribe({
        next: (response) => {
          this.isSyncing.set(false);

          const matchedCommits = response.commits ?? [];
          const recentCommits = response.recentCommits ?? [];

          this.matchedGitCommits.set(matchedCommits);
          this.recentGitCommits.set(recentCommits);

          this.selectedRecentCommitIds.set([
            ...matchedCommits.map((commit) => commit.id),
            ...selectedManualEvidenceIds,
          ]);

          this.aiFallbackMessage.set(
            response.description ||
              (matchedCommits.length > 0
                ? `${matchedCommits.length} کامیت مرتبط پیدا شد. انتخاب‌ها را بازبینی کن.`
                : `برای ${selectedTask.key ?? selectedTask.id} کامیت مستقیمی پیدا نشد. از فعالیت‌های اخیر انتخاب کن.`),
          );

          if (matchedCommits.length === 0 && recentCommits.length === 0) {
            this.mutationState.set({
              data: null,
              loading: false,
              error:
                'هیچ کامیت Git برای این تسک یا فعالیت‌های اخیر پیدا نشد. می‌توانی مسیر دستی را ادامه بدهی.',
            });
            return;
          }

          this.mutationState.set({ data: null, loading: false, error: null });
        },

        error: (err) => {
          this.isSyncing.set(false);
          this.matchedGitCommits.set([]);
          this.recentGitCommits.set([]);
          this.selectedRecentCommitIds.set(selectedManualEvidenceIds);
          this.aiFallbackMessage.set('');
          this.aiConfidenceScore.set(null);
          this.aiEvidenceSummary.set('');

          this.mutationState.set({
            data: null,
            loading: false,
            error:
              err?.message ||
              err?.error?.error ||
              err?.error?.debugMessage ||
              'خطا در دریافت شواهد Git از integration proxy.',
          });
        },
      });
  }
  loadJiraTasks(): void {
    this.gitlabSyncService.getAssignedTasks().subscribe({
      next: (tasks) => {
        this.jiraTasks.set(tasks);
        this.showJiraDropdown.set(true);
      },

      error: (error) => {
        this.mutationState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت تسک‌های انتسابی از integration proxy.',
        });
      },
    });
  }
  selectJiraTaskById(taskId: string): void {
    const task = this.jiraTasks().find((item) => String(item.id) === taskId || item.key === taskId);

    if (!task) {
      this.selectedJiraTask.set(null);
      return;
    }

    this.selectJiraTask(task);
  }

  selectJiraTask(task: ExternalTaskSourceItem, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.recentGitCommits.set([]);
    this.selectedRecentCommitIds.set([]);
    this.aiFallbackMessage.set('');
    this.selectedJiraTask.set(task);
    this.showJiraDropdown.set(false);
    this.flowType.set(null);

    this.mutationState.set({ data: null, loading: false, error: null });
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('');
    this.manualGitCommits.set([]);
    this.manualEvidenceTitle.set('');

    this.taskForm.patchValue({
      title: `[${task.key ?? task.id}] ${task.title}`,
      project: task.project_id ?? 0,
      project_service: task.service_id ?? 0,
      project_contract: task.contract_id ?? 0,
      location: task.location ?? 'teleworking',
    });

    if (task.project_id && task.project_id > 0) {
      this.loadProjectDetails(task.project_id, {
        serviceId: task.service_id ?? 0,
        contractId: task.contract_id ?? 0,
      });
    } else {
      this.projectDetailsState.set({ data: null, loading: false, error: null });
    }
  }
  toggleRecentCommitSelection(commitId: string): void {
    const current = this.selectedRecentCommitIds();

    if (current.includes(commitId)) {
      this.selectedRecentCommitIds.set(current.filter((id) => id !== commitId));
      return;
    }

    this.selectedRecentCommitIds.set([...current, commitId]);
  }

  useSelectedRecentCommits(): void {
    const selectedIds = new Set(this.selectedRecentCommitIds());
    const allCandidateCommits = [
      ...this.matchedGitCommits(),
      ...this.recentGitCommits(),
      ...this.manualGitCommits(),
    ];
    const selectedCommits = allCandidateCommits.filter((commit) => selectedIds.has(commit.id));
    const selectedTask = this.selectedJiraTask();

    if (selectedCommits.length === 0) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'حداقل یک فعالیت یا کامیت را انتخاب کن یا مسیر دستی را ادامه بده.',
      });
      return;
    }

    if (!selectedTask) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'اول عنوان کار را مشخص کن.',
      });
      return;
    }

    this.currentStep.set(4);
    this.isSyncing.set(true);
    this.aiConfidenceScore.set(null);
    this.aiEvidenceSummary.set('در حال ساخت توضیحات از فعالیت‌های انتخاب‌شده...');
    this.mutationState.set({ data: null, loading: false, error: null });

    this.gitlabSyncService
      .syncEvidenceFromCommits({
        taskKey: selectedTask.key ?? selectedTask.id,
        title: selectedTask.title,
        commits: selectedCommits,
        tone: this.aiTone(),
        detailLevel: this.aiDetailLevel(),
        extraInstruction: this.aiExtraInstruction().trim(),
      })
      .subscribe({
        next: (response) => {
          this.isSyncing.set(false);

          if (!response.success) {
            this.applyEvidenceDraftToForm(response, selectedTask);

            this.aiConfidenceScore.set(response.confidenceScore ?? 55);
            this.aiEvidenceSummary.set(
              response.code === 'AI_PROVIDER_TIMEOUT'
                ? 'فعالیت‌ها انتخاب شدند اما AI به timeout خورد؛ متن اولیه از evidenceها ساخته شد.'
                : 'فعالیت‌ها انتخاب شدند اما AI خطا داد؛ متن اولیه از evidenceها ساخته شد.',
            );

            this.mutationState.set({
              data: null,
              loading: false,
              error: null,
            });

            return;
          }
          this.isSyncing.set(false);

          this.applyEvidenceDraftToForm(response, selectedTask);

          this.aiConfidenceScore.set(response.confidenceScore ?? null);
          this.aiEvidenceSummary.set(
            [
              response.evidence?.commitCount != null
                ? `${response.evidence.commitCount} فعالیت انتخاب‌شده بررسی شد`
                : null,
              response.confidenceLabel ? `سطح اطمینان: ${response.confidenceLabel}` : null,
            ]
              .filter(Boolean)
              .join('، ') || 'فعالیت‌های انتخاب‌شده با AI بررسی شدند.',
          );

          this.mutationState.set({
            data: null,
            loading: false,
            error: null,
          });
        },

        error: (err) => {
          this.isSyncing.set(false);

          const fallbackDescription = [
            'توضیحات اولیه بر اساس فعالیت‌های انتخاب‌شده:',
            '',
            ...selectedCommits.map((commit) => `- ${commit.title}`),
          ].join('\n');

          this.patchAiValueIfSafe('description', fallbackDescription);

          this.aiConfidenceScore.set(45);
          this.aiEvidenceSummary.set(
            'AI خطا داد؛ توضیحات اولیه از روی فعالیت‌های انتخاب‌شده ساخته شد و نیازمند بازبینی است.',
          );

          this.mutationState.set({
            data: null,
            loading: false,
            error: err?.message || 'خطا در تولید توضیحات AI از فعالیت‌های انتخاب‌شده.',
          });
        },
      });
  }
  visibleTasks = computed(() => {
    const request = this.layout.searchRequest();

    if (!request || request.scope !== 'current_page' || request.pageKey !== 'tasks') {
      return this.tasks;
    }

    const query = request.query.toLowerCase();

    return this.tasks.filter((task) => {
      return [
        task.title,
        task.description,
        task.project_title,
        task.status,
        String(task.id),
        task.date,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  });
  selectManualTask(): void {
    const title = this.manualTaskTitle().trim();
    const rawKey = this.manualTaskKey().trim();

    if (!title) {
      this.mutationState.set({
        data: null,
        loading: false,
        error: 'برای ثبت کارکرد بدون Jira، عنوان کار را وارد کن.',
      });
      return;
    }

    const key = rawKey || `MANUAL-${Date.now()}`;

    const manualTask: ExternalTaskSourceItem = {
      id: key,
      key: rawKey || undefined,
      title,
      project_id: null,
      service_id: null,
      contract_id: null,
      location: 'teleworking',
      source: 'manual',
    };
    this.manualGitCommits.set([]);
    this.manualEvidenceTitle.set('');
    this.selectJiraTask(manualTask);
  }
}
