import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { ApiState } from '../../shared/models/api-state.model';
import { DashboardService } from './services/dashboard.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  layout = inject(LayoutService);

  statsState = signal<ApiState<DashboardStats>>({
    data: null,
    loading: false,
    error: null,
  });

  private readonly userId = environment.temporaryUserId;
  private readonly range = 'month_till_today';

  constructor() {
    this.layout.isTasksPage.set(false);
  }

  ngOnInit(): void {
    this.loadStats();
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
    if (minutes == null) return '-';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
  }
}
