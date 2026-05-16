import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';
import { DashboardStats } from '../../shared/models/dashboard.model';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  layout = inject(LayoutService);

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

  constructor() {
    this.layout.isTasksPage.set(false);
    this.layout.dashboardRange.set(this.selectedRange() as TaskRange);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadLineChart();
    this.loadPublicNews();
    this.loadPublicNewsCount();
    this.loadPublicNews();
    this.loadPublicNewsCount();
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
  }

  isDashboardRangeActive(range: string): boolean {
    return this.selectedRange() === range;
  }

  get selectedRangeLabel(): string {
    return this.dashboardRanges.find((item) => item.key === this.selectedRange())?.label ?? 'بازه';
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

  // ۳. تبدیل دیتای API به تنظیمات نمودار خطی ECharts
  private buildLineChartOption(data: any[]): EChartsOption {
    return {
      backgroundColor: 'transparent',

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
        data: data.map((item) => item.date),

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

          areaStyle: {
            opacity: 0.12,
          },

          lineStyle: {
            width: 3,
            color: '#3b82f6',
          },

          itemStyle: {
            color: '#3b82f6',
          },

          data: data.map((item) => item.presence),
        },
      ],
    };
  }
}
