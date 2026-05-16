import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Subscription, interval, finalize } from 'rxjs';
import { differenceInSeconds, format, parse } from 'date-fns-jalali';

import { LayoutService } from '../../services/layout/layout.service';
import { AuthService } from '../../services/auth/auth.service';
import { DashboardService } from '../../../features/dashboard/services/dashboard.service';
import { PresenceService } from '../../../features/presence/services/presence.service';
import { TasksService } from '../../../features/tasks/services/tasks.service';
import { TasksFiltersService } from '../../../features/tasks/services/tasks-filters.service';
import { Project, ProjectDetailsResponse } from '../../../shared/models/project.model';

import { ApiState } from '../../../shared/models/api-state.model';
import { DashboardPieItem } from '../../../shared/models/dashboard.model';
import { TaskItem } from '../../../shared/models/task.model';
import {
  ActivePresenceResponse,
  PresenceCountResponse,
} from '../../../shared/models/presence.model';
import { DashboardProfileSummaryResponse } from '../../../shared/models/dashboard.model';
import { TasksCountResponse } from '../../../shared/models/task.model';

type ProjectDistributionItem = DashboardPieItem & {
  percent: number;
  color: string;
};

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './left-sidebar.html',
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  layout = inject(LayoutService);

  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly presenceService = inject(PresenceService);
  private readonly tasksService = inject(TasksService);
  readonly taskFilters = inject(TasksFiltersService);
  readonly presenceMutationDryRun = signal(true);
  readonly sidebarRangeLabels: Record<string, string> = {
    month_till_today: 'ماه جاری تا امروز',
    month: 'ماه مالی کامل',
    last_month: 'ماه مالی گذشته',
    today: 'امروز',
    yesterday: 'دیروز',
    week: 'هفته جاری',
    last_week: 'هفته گذشته',
    this_year: 'سال جاری',
  };

  readonly sidebarStatsRangeLabel = computed(() => {
    return this.sidebarRangeLabels[this.layout.dashboardRange()] ?? 'بازه انتخاب‌شده';
  });

  taskFilterProjectsState = signal<ApiState<Project[]>>({
    data: null,
    loading: false,
    error: null,
  });

  taskFilterProjectDetailsState = signal<ApiState<ProjectDetailsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  private taskFilterProjectsLoaded = false;

  presenceActionLoading = signal(false);
  presenceActionError = signal<string | null>(null);
  runningTaskTimerSeconds = signal(0);
  runningTaskTimerActive = signal(false);

  private runningTaskTimerSub?: Subscription;
  // Dashboard project distribution chart state.
  pieChartState = signal<ApiState<EChartsOption>>({
    data: null,
    loading: true,
    error: null,
  });

  // Real WTT presence counter state.
  presenceCountState = signal<ApiState<PresenceCountResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  // Current open presence record, if the user is currently clocked in.
  activePresenceState = signal<ApiState<ActivePresenceResponse | null>>({
    data: null,
    loading: true,
    error: null,
  });

  // Latest incomplete task used as a running-task shortcut placeholder.
  runningTaskState = signal<ApiState<TaskItem | null>>({
    data: null,
    loading: true,
    error: null,
  });

  currentPresenceSeconds = signal(0);

  readonly Number = Number;

  readonly pieColors = ['#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444'];

  pieChartItems = signal<DashboardPieItem[]>([]);

  constructor() {
    effect(() => {
      const isTasksPage = this.layout.isTasksPage();

      if (!isTasksPage) return;

      untracked(() => {
        this.loadTaskFilterProjects();
      });
    });
    effect(() => {
      const isTasksPage = this.layout.isTasksPage();
      const range = this.layout.dashboardRange();

      if (isTasksPage || !range) return;

      untracked(() => {
        this.loadPieChart();
        this.loadSidebarStats();
      });
    });
  }

  projectDistributionItems = computed<ProjectDistributionItem[]>(() => {
    const items: DashboardPieItem[] = this.pieChartItems();

    const total = items.reduce((sum: number, item: DashboardPieItem) => {
      return sum + Number(item.value ?? 0);
    }, 0);

    if (total <= 0) {
      return [];
    }

    return items.map((item: DashboardPieItem, index: number): ProjectDistributionItem => {
      return {
        ...item,
        color: this.pieColors[index % this.pieColors.length],
        percent: Math.round((Number(item.value ?? 0) / total) * 100),
      };
    });
  });
  readonly hasActivePresence = computed(() => {
    return (this.presenceCountState().data?.no_end ?? 0) > 0;
  });

  private timerSub?: Subscription;

  ngOnInit(): void {
    if (!this.layout.isTasksPage()) {
      this.loadPresenceState();
      this.loadLatestIncompleteTask();
    }
  }

  ngOnDestroy(): void {
    this.stopPresenceTimer();
    this.stopRunningTaskTimer();
  }

  loadPieChart(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.pieChartState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد.',
      });

      return;
    }

    this.pieChartState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getPieChart(userId, this.layout.dashboardRange()).subscribe({
      next: (response) => {
        if (!response.length) {
          this.pieChartItems.set([]);

          this.pieChartState.set({
            data: null,
            loading: false,
            error: null,
          });

          return;
        }

        this.pieChartItems.set(response);

        this.pieChartState.set({
          data: this.buildPieChartOption(response),
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.pieChartItems.set([]);
        this.pieChartState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت توزیع پروژه‌ها',
        });
      },
    });
  }
  loadTaskFilterProjects(): void {
    if (this.taskFilterProjectsLoaded) return;

    this.taskFilterProjectsLoaded = true;

    this.taskFilterProjectsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getProjects().subscribe({
      next: (projects) => {
        this.taskFilterProjectsState.set({
          data: projects,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.taskFilterProjectsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت پروژه‌ها',
        });
      },
    });
  }

  onTaskFilterProjectChange(projectId: number | string): void {
    const selectedProjectId = Number(projectId) || null;

    this.taskFilters.selectedProjectId.set(selectedProjectId);
    this.taskFilters.selectedServiceId.set(null);
    this.taskFilters.selectedContractId.set(null);

    if (!selectedProjectId) {
      this.taskFilterProjectDetailsState.set({
        data: null,
        loading: false,
        error: null,
      });

      return;
    }

    this.loadTaskFilterProjectDetails(selectedProjectId);
  }

  loadTaskFilterProjectDetails(projectId: number): void {
    this.taskFilterProjectDetailsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getProjectDetails(projectId).subscribe({
      next: (details) => {
        this.taskFilterProjectDetailsState.set({
          data: details,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.taskFilterProjectDetailsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت خدمات و قراردادها',
        });
      },
    });
  }

  applyTaskSidebarFilters(): void {
    this.taskFilters.apply();
  }

  resetTaskSidebarFilters(): void {
    this.taskFilters.reset();

    this.taskFilterProjectDetailsState.set({
      data: null,
      loading: false,
      error: null,
    });
  }

  loadPresenceState(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.presenceCountState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد.',
      });

      return;
    }

    this.presenceCountState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.presenceService.getPresenceCount(userId).subscribe({
      next: (count) => {
        this.presenceCountState.set({
          data: count,
          loading: false,
          error: null,
        });

        if (count.no_end > 0) {
          this.loadActivePresence();
          return;
        }

        this.activePresenceState.set({
          data: null,
          loading: false,
          error: null,
        });

        this.stopPresenceTimer();
      },

      error: () => {
        this.presenceCountState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت وضعیت حضور',
        });
      },
    });
  }

  private loadActivePresence(): void {
    this.activePresenceState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.presenceService.getActivePresence().subscribe({
      next: (presence) => {
        this.activePresenceState.set({
          data: presence,
          loading: false,
          error: null,
        });

        this.startPresenceTimer(presence.start_time);
      },

      error: () => {
        this.activePresenceState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت حضور فعال',
        });
      },
    });
  }

  loadLatestIncompleteTask(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.runningTaskState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد.',
      });

      return;
    }

    this.runningTaskState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService
      .getTasks(userId, {
        page: 1,
        range: 'month_till_today',
      })
      .subscribe({
        next: (response) => {
          const tasks = this.extractTasksFromResponse(response);
          const latestIncompleteTask = this.findLatestIncompleteTask(tasks);

          this.stopRunningTaskTimer();
          this.runningTaskTimerSeconds.set(0);

          this.runningTaskState.set({
            data: latestIncompleteTask,
            loading: false,
            error: null,
          });
        },

        error: () => {
          this.runningTaskState.set({
            data: null,
            loading: false,
            error: 'خطا در دریافت آخرین تسک',
          });
        },
      });
  }

  clockIn(): void {
    if (this.handlePresenceDryRun('clock-in')) {
      return;
    }
    if (this.presenceActionLoading()) {
      return;
    }

    if (this.hasActivePresence()) {
      this.presenceActionError.set('حضور فعال داری؛ امکان ثبت ورود دوباره وجود ندارد.');
      return;
    }

    const confirmed = window.confirm('آیا می‌خواهی حضور امروز را شروع کنی؟');

    if (!confirmed) {
      return;
    }

    this.presenceActionLoading.set(true);
    this.presenceActionError.set(null);

    const now = this.buildCurrentDateTime();

    this.presenceService
      .clockIn({ start_time: now })
      .pipe(
        finalize(() => {
          this.presenceActionLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.loadPresenceState();
        },

        error: () => {
          this.presenceActionError.set('خطا در ثبت ورود. وضعیت حضور را دوباره بررسی کن.');
        },
      });
  }

  clockOut(): void {
    if (this.handlePresenceDryRun('clock-out')) {
      return;
    }
    if (this.presenceActionLoading()) {
      return;
    }

    const activePresence = this.activePresenceState().data;

    if (!activePresence?.id) {
      this.presenceActionError.set('حضور فعال پیدا نشد. یک بار وضعیت حضور را تازه‌سازی کن.');
      this.loadPresenceState();
      return;
    }

    const confirmed = window.confirm('آیا می‌خواهی خروج را ثبت کنی؟');

    if (!confirmed) {
      return;
    }

    this.presenceActionLoading.set(true);
    this.presenceActionError.set(null);

    const now = this.buildCurrentDateTime();

    this.presenceService
      .clockOut(activePresence.id, {
        start_time: activePresence.start_time,
        end_time: now,
      })
      .pipe(
        finalize(() => {
          this.presenceActionLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.loadPresenceState();
        },

        error: () => {
          this.presenceActionError.set('خطا در ثبت خروج. لطفاً وضعیت حضور را بررسی کن.');
        },
      });
  }

  formatPresenceTimer(seconds: number): string {
    const safeSeconds = Math.max(0, seconds);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(remainingSeconds).padStart(2, '0'),
    ].join(':');
  }
  private startPresenceTimer(startTime: string): void {
    this.stopPresenceTimer();

    // Parse real WTT Jalali datetime and calculate elapsed seconds.
    const parsedStartTime = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());

    this.currentPresenceSeconds.set(Math.max(0, differenceInSeconds(new Date(), parsedStartTime)));

    this.timerSub = interval(1000).subscribe(() => {
      this.currentPresenceSeconds.update((seconds) => seconds + 1);
    });
  }

  private stopPresenceTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;
    this.currentPresenceSeconds.set(0);
  }

  private buildCurrentDateTime(): string {
    // WTT v1 expects Jalali datetime in this exact format.
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }

  private findLatestIncompleteTask(tasks: TaskItem[] | null | undefined): TaskItem | null {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return null;
    }

    const incompleteStatuses = ['pending', 'rejected', 'edited', 'draft'];

    // Prefer incomplete tasks. If none exists, show the latest task as a shortcut placeholder.
    return tasks.find((task) => incompleteStatuses.includes(task.status)) ?? tasks[0] ?? null;
  }
  private extractTasksFromResponse(response: unknown): TaskItem[] {
    // The task endpoint shape may differ between mock, contract, and real WTT API.
    // Keep LeftSidebar safe until Tasks real integration is finalized.
    if (Array.isArray(response)) {
      return response as TaskItem[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const possibleResponse = response as {
      data?: TaskItem[];
      results?: TaskItem[];
      tasks?: TaskItem[];
      tasks_list?: {
        requested_ui_response?: {
          data?: TaskItem[];
        };
      };
    };

    if (Array.isArray(possibleResponse.data)) {
      return possibleResponse.data;
    }

    if (Array.isArray(possibleResponse.results)) {
      return possibleResponse.results;
    }

    if (Array.isArray(possibleResponse.tasks)) {
      return possibleResponse.tasks;
    }

    if (Array.isArray(possibleResponse.tasks_list?.requested_ui_response?.data)) {
      return possibleResponse.tasks_list.requested_ui_response.data;
    }

    return [];
  }

  private buildPieChartOption(data: DashboardPieItem[]): EChartsOption {
    return {
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        confine: false,
        backgroundColor: '#020617',
        borderColor: 'rgba(148, 163, 184, 0.25)',
        borderWidth: 1,
        textStyle: {
          color: '#e5e7eb',
          fontSize: 11,
        },
        extraCssText:
          'z-index: 9999; border-radius: 10px; box-shadow: 0 12px 30px rgba(0,0,0,0.35);',
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 4 },
          label: { show: false },
          emphasis: { label: { show: false } },
          data: data.map((item) => ({ value: item.value, name: item.project })),
          color: this.pieColors,
        },
      ],
    };
  }
  private handlePresenceDryRun(action: 'clock-in' | 'clock-out'): boolean {
    // Safe test mode: prove the click works without mutating real WTT attendance.
    if (!this.presenceMutationDryRun()) {
      return false;
    }

    this.presenceActionError.set(
      action === 'clock-in'
        ? 'تست کلیک ورود انجام شد؛ برای امنیت فقط وضعیت حضور دوباره خوانده شد.'
        : 'تست کلیک خروج انجام شد؛ برای امنیت فقط وضعیت حضور دوباره خوانده شد.',
    );

    this.loadPresenceState();
    return true;
  }
  toggleRunningTaskTimer(): void {
    if (!this.runningTaskState().data) {
      return;
    }

    if (this.runningTaskTimerActive()) {
      this.stopRunningTaskTimer();
      return;
    }

    this.startRunningTaskTimer();
  }

  private startRunningTaskTimer(): void {
    this.runningTaskTimerSub?.unsubscribe();
    this.runningTaskTimerActive.set(true);

    this.runningTaskTimerSub = interval(1000).subscribe(() => {
      this.runningTaskTimerSeconds.update((seconds) => seconds + 1);
    });
  }

  private stopRunningTaskTimer(): void {
    this.runningTaskTimerSub?.unsubscribe();
    this.runningTaskTimerSub = undefined;
    this.runningTaskTimerActive.set(false);
  }
  togglePresenceAction(): void {
    // The presence orb is the interaction point.
    // In dry-run mode it only refetches presence state and does not mutate real WTT attendance.
    if (this.presenceActionLoading()) {
      return;
    }

    if (this.hasActivePresence()) {
      this.clockOut();
      return;
    }

    this.clockIn();
  }
  todayProfileState = signal<ApiState<DashboardProfileSummaryResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  todayTasksCountState = signal<ApiState<TasksCountResponse>>({
    data: null,
    loading: true,
    error: null,
  });
  loadSidebarStats(): void {
    const userId = this.authService.getCurrentUserId();
    const range = this.layout.dashboardRange();

    if (!userId) {
      this.todayProfileState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد.',
      });

      this.todayTasksCountState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد.',
      });

      return;
    }

    this.todayProfileState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.todayTasksCountState.set({
      data: null,
      loading: true,
      error: null,
    });
    this.dashboardService.getProfileSummary(userId, range).subscribe({
      next: (response) => {
        this.todayProfileState.set({
          data: response,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.todayProfileState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت آمار بازه',
        });
      },
    });

    this.tasksService
      .getTasksCount({
        range,
      })
      .subscribe({
        next: (response) => {
          this.todayTasksCountState.set({
            data: response,
            loading: false,
            error: null,
          });
        },

        error: () => {
          this.todayTasksCountState.set({
            data: null,
            loading: false,
            error: 'خطا در دریافت تعداد تسک‌ها',
          });
        },
      });
  }
  formatShortMinutes(minutes: number | null | undefined): string {
    if (minutes == null || minutes <= 0) {
      return '00:00';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
}
