import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { ApiState } from '../../shared/models/api-state.model';
import { ReportRange, ReportResponse, ReportStatus } from '../../shared/models/report.model';
import { ReportsService } from './services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private readonly authService = inject(AuthService);

  selectedRange = signal<ReportRange>('month');
  reportState = signal<ApiState<ReportResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  readonly ranges = [
    { key: 'today', label: 'امروز' },
    { key: 'week', label: 'این هفته' },
    { key: 'month', label: 'ماه جاری' },
    { key: 'last_month', label: 'ماه گذشته' },
  ] as const;

  ngOnInit(): void {
    this.loadReport();
  }

  get report(): ReportResponse | null {
    return this.reportState().data;
  }

  loadReport(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.reportState.set({
        data: null,
        loading: false,
        error: 'شناسه کاربر پیدا نشد. لطفاً دوباره وارد شوید.',
      });

      return;
    }

    this.reportState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.reportsService.getReport(userId, this.selectedRange()).subscribe({
      next: (response) => {
        this.reportState.set({
          data: response,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.reportState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت گزارش وظایف WTT',
        });
      },
    });
  }

  setRange(range: ReportRange): void {
    if (this.selectedRange() === range) return;

    this.selectedRange.set(range);
    this.loadReport();
  }

  statusLabel(status: ReportStatus): string {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'pending':
        return 'در انتظار بررسی';
      case 'rejected':
        return 'نیازمند اصلاح';
      case 'draft':
        return 'پیش‌نویس';
      case 'edited':
        return 'ویرایش‌شده';
      case 'unknown':
        return 'نامشخص';
    }
  }

  statusClass(status: ReportStatus): string {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 ring-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-500 ring-rose-500/20';
      case 'draft':
        return 'bg-slate-500/10 text-slate-500 ring-slate-500/20';
      case 'edited':
        return 'bg-cyan-500/10 text-cyan-500 ring-cyan-500/20';
      case 'unknown':
        return 'bg-zinc-500/10 text-zinc-500 ring-zinc-500/20';
    }
  }
}
