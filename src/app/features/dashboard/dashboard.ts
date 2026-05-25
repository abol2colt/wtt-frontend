import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';
import { DashboardStats, DashboardPieItem } from '../../shared/models/dashboard.model';
import { ApiState } from '../../shared/models/api-state.model';
import { DashboardService } from './services/dashboard.service';
import { EChartsOption } from 'echarts';
import { AuthService } from '../../core/services/auth/auth.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { TaskRange } from '../../shared/models/task.model';
import {
  NewsMessagesCountResponse,
  NewsMessagesResponse,
} from '../../shared/models/dashboard.model';
import { RouterLink } from '@angular/router';

type ProjectDistributionItem = DashboardPieItem & {
  percent: number;
  color: string;
};
type DashboardLineChartPoint = {
  date?: string | null;
  day?: string | null;
  label?: string | null;
  total_work?: number | null;
  presence?: number | null;
  value?: number | null;
  minutes?: number | null;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  layout = inject(LayoutService);
  projectDistributionState = signal<ApiState<EChartsOption>>({
    data: null,
    loading: true,
    error: null,
  });

  projectDistributionItems = signal<DashboardPieItem[]>([]);

  readonly projectDistributionColors = ['#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444'];

  readonly projectDistributionLegendItems = computed<ProjectDistributionItem[]>(() => {
    const items = this.projectDistributionItems();

    const total = items.reduce((sum, item) => {
      return sum + Number(item.value ?? 0);
    }, 0);

    if (total <= 0) {
      return [];
    }

    return items.map((item, index) => {
      return {
        ...item,
        color: this.projectDistributionColors[index % this.projectDistributionColors.length],
        percent: Math.round((Number(item.value ?? 0) / total) * 100),
      };
    });
  });
  publicNewsState = signal<ApiState<NewsMessagesResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  privateNewsState = signal<ApiState<NewsMessagesResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  publicNewsCountState = signal<ApiState<NewsMessagesCountResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  statsState = signal<ApiState<DashboardStats>>({
    data: null,
    loading: true,
    error: null,
  });

  lineChartState = signal<ApiState<EChartsOption>>({ data: null, loading: true, error: null });

  readonly dashboardRanges: { key: TaskRange; label: string }[] = [
    { key: 'month_till_today', label: 'ماه جاری تا امروز' },
    { key: 'month', label: 'ماه مالی کامل' },
    { key: 'last_month', label: 'ماه مالی گذشته' },
    { key: 'today', label: 'امروز' },
    { key: 'yesterday', label: 'دیروز' },
    { key: 'week', label: 'هفته جاری' },
    { key: 'this_year', label: 'سال جاری' },
  ];

  selectedRange = signal('month_till_today');
  dashboardFilterOpen = signal(false);

  private dashboardFilterCloseTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.layout.isTasksPage.set(false);
    this.layout.dashboardRange.set(this.selectedRange() as TaskRange);
  }

  hasDashboardSearchResults(): boolean {
    return this.matchesDashboardSearch(
      'زمان مورد انتظار',
      'کل کارکرد',
      'اضافه کاری',
      'اضافه‌کاری',
      'مرخصی',
      'روند کارکرد',
      'نمودار',
      'اطلاعیه',
      'پیام',
      'عمومی',
      'شخصی',
      'خلاصه',
      'مرکز پیام‌ها',
      'ثبت کارکرد',
      'وظایف',
      'اقدام سریع',
      this.selectedRangeLabel,
    );
  }

  ngOnInit(): void {
    this.layout.showWelcomeSplashOnce();
    this.loadStats();
    this.loadLineChart();
    this.loadPublicNews();
    this.loadPrivateNews();
    this.loadPublicNewsCount();
    this.loadProjectDistribution();
  }

  ngOnDestroy(): void {
    this.clearDashboardFilterAutoClose();
  }

  toggleDashboardFilter(): void {
    if (this.dashboardFilterOpen()) {
      this.closeDashboardFilter();
      return;
    }

    this.openDashboardFilter();
  }

  openDashboardFilter(): void {
    this.dashboardFilterOpen.set(true);
    this.scheduleDashboardFilterAutoClose();
  }

  closeDashboardFilter(): void {
    this.dashboardFilterOpen.set(false);
    this.clearDashboardFilterAutoClose();
  }

  scheduleDashboardFilterAutoClose(): void {
    this.clearDashboardFilterAutoClose();

    this.dashboardFilterCloseTimer = setTimeout(() => {
      this.dashboardFilterOpen.set(false);
    }, 5000);
  }

  clearDashboardFilterAutoClose(): void {
    if (!this.dashboardFilterCloseTimer) return;

    clearTimeout(this.dashboardFilterCloseTimer);
    this.dashboardFilterCloseTimer = undefined;
  }

  selectDashboardRangeFromDropdown(range: TaskRange): void {
    this.setDashboardRange(range);
    this.closeDashboardFilter();
  }

  setDashboardRange(range: TaskRange): void {
    if (this.selectedRange() === range) return;

    this.selectedRange.set(range);
    this.layout.dashboardRange.set(range);
    this.loadStats();
    this.loadLineChart();
    this.loadPublicNews();
    this.loadPrivateNews();
    this.loadPublicNewsCount();
    this.loadProjectDistribution();
  }

  isDashboardRangeActive(range: string): boolean {
    return this.selectedRange() === range;
  }

  get selectedRangeLabel(): string {
    return this.dashboardRanges.find((item) => item.key === this.selectedRange())?.label ?? 'بازه';
  }

  get publicAnnouncementsCount(): number {
    return this.publicNewsState().data?.results?.length ?? 0;
  }

  get privateAnnouncementsCount(): number {
    return this.privateNewsState().data?.results?.length ?? 0;
  }

  get hasAnyAnnouncement(): boolean {
    return this.publicAnnouncementsCount + this.privateAnnouncementsCount > 0;
  }

  loadStats(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.statsState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد. لطفاً دوباره وارد شوید.',
      });

      return;
    }

    this.statsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getStats(userId, this.selectedRange()).subscribe({
      next: (response) => {
        this.statsState.set({
          data: response.data,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.statsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت اطلاعات داشبورد',
        });
      },
    });
  }
  loadPublicNews(): void {
    this.publicNewsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getNewsMessages('public', this.selectedRange()).subscribe({
      next: (response) => {
        this.publicNewsState.set({
          data: response,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.publicNewsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت اطلاعیه‌های عمومی',
        });
      },
    });
  }

  loadPrivateNews(): void {
    this.privateNewsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getNewsMessages('private', this.selectedRange()).subscribe({
      next: (response) => {
        this.privateNewsState.set({
          data: response,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.privateNewsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت اطلاعیه‌های شخصی',
        });
      },
    });
  }

  loadPublicNewsCount(): void {
    this.publicNewsCountState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getNewsMessagesCount('public', this.selectedRange()).subscribe({
      next: (response) => {
        this.publicNewsCountState.set({
          data: response,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.publicNewsCountState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت آمار اطلاعیه‌ها',
        });
      },
    });
  }
  formatMinutes(minutes: number | null | undefined): string {
    if (minutes == null || minutes === 0) return '۰ دقیقه';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} دقیقه`;
    return `${hours}${mins > 0 ? ':' + mins : ''}`;
  }

  // line chart
  loadLineChart(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.lineChartState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد. لطفاً دوباره وارد شوید.',
      });

      return;
    }
    this.lineChartState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getLineChart(userId, this.selectedRange()).subscribe({
      next: (response) => {
        if (!response.length) {
          this.lineChartState.set({
            data: null,
            loading: false,
            error: null,
          });
          return;
        }

        const chartOption = this.buildLineChartOption(response);

        this.lineChartState.set({
          data: chartOption,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.lineChartState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت روند کارکرد',
        });
      },
    });
  }
  loadProjectDistribution(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.projectDistributionItems.set([]);

      this.projectDistributionState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد. لطفاً دوباره وارد شوید.',
      });

      return;
    }

    this.projectDistributionState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getPieChart(userId, this.selectedRange()).subscribe({
      next: (response) => {
        if (!response.length) {
          this.projectDistributionItems.set([]);

          this.projectDistributionState.set({
            data: null,
            loading: false,
            error: null,
          });

          return;
        }

        this.projectDistributionItems.set(response);

        this.projectDistributionState.set({
          data: this.buildProjectDistributionOption(response),
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.projectDistributionItems.set([]);

        this.projectDistributionState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت توزیع پروژه‌ها',
        });
      },
    });
  }
private buildProjectDistributionOption(data: DashboardPieItem[]): EChartsOption {
  return {
    backgroundColor: 'transparent',

    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: '#020617',
      borderColor: 'rgba(148, 163, 184, 0.25)',
      borderWidth: 1,
      textStyle: {
        color: '#e5e7eb',
        fontSize: 11,
      },
      extraCssText:
        'z-index: 9999; border-radius: 12px; box-shadow: 0 16px 34px rgba(0,0,0,0.35);',
    },

    legend: {
      show: false,
    },

    series: [
      {
        name: 'توزیع پروژه‌ها',
        type: 'pie',
        radius: ['58%', '82%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,

        itemStyle: {
          borderRadius: 12,
          borderColor: 'rgba(255, 255, 255, 0.9)',
          borderWidth: 3,
          shadowBlur: 16,
          shadowColor: 'rgba(59, 130, 246, 0.18)',
        },

        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },

        emphasis: {
          scale: true,
          scaleSize: 7,
          itemStyle: {
            shadowBlur: 24,
            shadowColor: 'rgba(6, 182, 212, 0.3)',
          },
        },

        data: data.map((item) => ({
          value: item.value,
          name: item.project,
        })),

        color: this.projectDistributionColors,
      },
    ],
  };
}

matchesDashboardSearch(...values: unknown[]): boolean {
  const request = this.layout.searchRequest();

  if (!request || request.scope !== 'current_page' || request.pageKey !== 'dashboard') {
    return true;
  }

  const query = request.query.toLowerCase();

  return values.filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
}

private buildLineChartOption(data: DashboardLineChartPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 450,

    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      backgroundColor: '#020617',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      textStyle: {
        color: '#e5e7eb',
        fontSize: 11,
      },
    },

    grid: {
      left: 34,
      right: 20,
      top: 24,
      bottom: 24,
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((item, index) => item.date ?? item.day ?? item.label ?? String(index + 1)),
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
      },
      axisLabel: {
        color: 'rgba(148, 163, 184, 0.65)',
        fontSize: 10,
        formatter: (value: string) => value.slice(5),
      },
      splitLine: {
        show: false,
      },
    },

    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: 'rgba(148, 163, 184, 0.65)',
        fontSize: 10,
        formatter: (value: number) => `${Math.round(value / 60)}h`,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.05)',
          width: 1,
        },
      },
    },

    series: [
      {
        name: 'کارکرد',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: true,
        animation: true,
        animationDuration: 950,
        animationEasing: 'cubicOut',

        areaStyle: {
          opacity: 0.12,
        },

        lineStyle: {
          width: 3,
          color: '#3b82f6',
        },

        itemStyle: {
          color: '#3b82f6',
          borderColor: '#ffffff',
          borderWidth: 2,
        },

        data: data.map((item) =>
          Number(item.total_work ?? item.presence ?? item.value ?? item.minutes ?? 0),
        ),
      },
    ],
  };
}
}
  