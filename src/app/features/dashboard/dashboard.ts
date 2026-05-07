import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { ApiState } from '../../shared/models/api-state.model';
import { DashboardService } from './services/dashboard.service';
import { environment } from '../../../environments/environment';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  layout = inject(LayoutService);

  statsState = signal<ApiState<DashboardStats>>({
    data: null,
    loading: true,
    error: null,
  });

  lineChartState = signal<ApiState<EChartsOption>>({ data: null, loading: true, error: null });

  private readonly userId = environment.temporaryUserId;
  private readonly range = 'month_till_today';

  constructor() {
    this.layout.isTasksPage.set(false);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadLineChart();
  }
  loadStats(): void {
    this.statsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getStats(this.userId, this.range).subscribe({
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

  formatMinutes(minutes: number | null | undefined): string {
    if (minutes == null || minutes === 0) return '۰ دقیقه';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} دقیقه`;
    return `${hours}${mins > 0 ? ':' + mins : ''}`;
  }

  // line chart
  loadLineChart(): void {
    this.lineChartState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getLineChart(this.userId, this.range).subscribe({
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
