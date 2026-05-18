import { Component, signal } from '@angular/core';

type ReportStatus = 'confirmed' | 'pending' | 'needs_correction';

interface ReportRow {
  id: number;
  date: string;
  title: string;
  project: string;
  duration: string;
  status: ReportStatus;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.html',
})
export class ReportsComponent {
  selectedRange = signal<'today' | 'week' | 'month' | 'last_month'>('month');

  readonly ranges = [
    { key: 'today', label: 'امروز' },
    { key: 'week', label: 'این هفته' },
    { key: 'month', label: 'ماه جاری' },
    { key: 'last_month', label: 'ماه گذشته' },
  ] as const;

  readonly rows: ReportRow[] = [
    {
      id: 1,
      date: '1405/02/28',
      title: 'بازبینی و تکمیل Smart Worklog',
      project: 'WTT Frontend',
      duration: '3س 20د',
      status: 'confirmed',
    },
    {
      id: 2,
      date: '1405/02/28',
      title: 'هماهنگ‌سازی ظاهر Tasks و Dashboard',
      project: 'WTT Frontend',
      duration: '1س 45د',
      status: 'pending',
    },
    {
      id: 3,
      date: '1405/02/27',
      title: 'اصلاح خطاهای دمو و حالت‌های خالی',
      project: 'WTT Frontend',
      duration: '2س 10د',
      status: 'needs_correction',
    },
  ];

  get totalDuration(): string {
    return '7س 15د';
  }

  get confirmedCount(): number {
    return this.rows.filter((row) => row.status === 'confirmed').length;
  }

  get correctionCount(): number {
    return this.rows.filter((row) => row.status === 'needs_correction').length;
  }

  setRange(range: 'today' | 'week' | 'month' | 'last_month'): void {
    this.selectedRange.set(range);
  }

  statusLabel(status: ReportStatus): string {
    switch (status) {
      case 'confirmed':
        return 'تایید شده';
      case 'pending':
        return 'در انتظار بررسی';
      case 'needs_correction':
        return 'نیازمند اصلاح';
    }
  }

  statusClass(status: ReportStatus): string {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 ring-amber-500/20';
      case 'needs_correction':
        return 'bg-rose-500/10 text-rose-500 ring-rose-500/20';
    }
  }
}
