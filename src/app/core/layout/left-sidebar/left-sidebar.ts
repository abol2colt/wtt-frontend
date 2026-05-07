import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../services/layout/layout.service'; // مسیر را چک کن
import { DashboardService } from '../../../features/dashboard/services/dashboard.service';
import { ApiState } from '../../../shared/models/api-state.model';
import { DashboardPieItem } from '../../../shared/models/dashboard.model';
import { environment } from '../../../../environments/environment';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './left-sidebar.html',
})
export class LeftSidebarComponent implements OnInit {
  layout = inject(LayoutService);
  private dashboardService = inject(DashboardService);

  pieChartState = signal<ApiState<EChartsOption>>({ data: null, loading: true, error: null });

  ngOnInit(): void {
    // LOAD == DASHBORD
    if (!this.layout.isTasksPage()) {
      this.loadPieChart();
    }
  }

  loadPieChart(): void {
    const userId = environment.temporaryUserId;

    this.pieChartState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getPieChart(userId, 'month_till_today').subscribe({
      next: (response) => {
        if (!response.length) {
          this.pieChartState.set({
            data: null,
            loading: false,
            error: null,
          });
          return;
        }

        const option = this.buildPieChartOption(response);

        this.pieChartState.set({
          data: option,
          loading: false,
          error: null,
        });
      },

      error: () => {
        this.pieChartState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت توزیع پروژه‌ها',
        });
      },
    });
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
          color: ['#3b82f6', '#a855f7', '#f59e0b', '#22c55e'],
        },
      ],
    };
  }
}
