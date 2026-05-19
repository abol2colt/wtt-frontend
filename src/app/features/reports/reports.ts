import { Component, OnDestroy, effect, inject, signal, untracked } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LayoutService } from '../../core/services/layout/layout.service';
import { ApiState } from '../../shared/models/api-state.model';
import {
  ActivityInProjectsReportResponse,
  ActivityUserRow,
  ReportRange,
  ReportsTab,
  UserAttendanceReportResponse,
  UserAttendanceRow,
} from '../../shared/models/report.model';
import { ReportsService } from './services/reports.service';

interface AttendanceSummaryView {
  usersCount: number;
  presenceMinutes: number;
  totalWorkMinutes: number;
  expectedMinutes: number;
  overtimeMinutes: number;
  averageEfficiency: number;
  taskDays: number;
  lunches: number;
  noWorkDays: number;
  acceptedVacations: number;
  acceptedMissions: number;
}

interface ActivityProjectView {
  userFullName: string;
  username: string;
  projectName: string;
  serviceName: string;
  spentMinutes: number;
  spentLabel: string;
  percentageText: string;
  percentageValue: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnDestroy {
  private readonly reportsService = inject(ReportsService);
  readonly layout = inject(LayoutService);

  selectedRange = this.layout.reportsRange;
  activeTab = this.layout.reportsTab;

  aiReportPreview = signal<string | null>(null);

  attendanceState = signal<ApiState<UserAttendanceReportResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  activityState = signal<ApiState<ActivityInProjectsReportResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  readonly ranges: { key: ReportRange; label: string }[] = [
    { key: 'month_till_today', label: 'ماه جاری تا امروز' },
    { key: 'month', label: 'ماه جاری' },
    { key: 'last_month', label: 'ماه گذشته' },
    { key: 'week', label: 'هفته جاری' },
    { key: 'today', label: 'امروز' },
    { key: 'this_year', label: 'سال جاری' },
  ];

  constructor() {
    this.layout.isReportsPage.set(true);
    this.layout.isTasksPage.set(false);
    this.layout.isPresencePage.set(false);

    effect(() => {
      this.selectedRange();

      untracked(() => {
        this.aiReportPreview.set(null);
        this.loadReports();
      });
    });
  }

  ngOnDestroy(): void {
    this.layout.isReportsPage.set(false);
  }

  setRange(range: ReportRange): void {
    if (this.selectedRange() === range) return;

    this.layout.setReportsRange(range);
  }

  setTab(tab: ReportsTab): void {
    this.layout.setReportsTab(tab);
  }

  loadReports(): void {
    this.attendanceState.set({ data: null, loading: true, error: null });
    this.activityState.set({ data: null, loading: true, error: null });

    const range = this.selectedRange();

    forkJoin({
      attendance: this.reportsService.getUserAttendance(range),
      activity: this.reportsService.getActivityInProjects(range),
    }).subscribe({
      next: ({ attendance, activity }) => {
        this.attendanceState.set({ data: attendance, loading: false, error: null });
        this.activityState.set({ data: activity, loading: false, error: null });
      },
      error: () => {
        this.attendanceState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت گزارش کلی کاربران',
        });

        this.activityState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت گزارش درصد فعالیت',
        });
      },
    });
  }

  get isLoading(): boolean {
    return this.attendanceState().loading || this.activityState().loading;
  }

  get hasError(): boolean {
    return Boolean(this.attendanceState().error || this.activityState().error);
  }

  get errorMessage(): string {
    return this.attendanceState().error || this.activityState().error || 'خطا در دریافت گزارش‌ها';
  }

  get attendanceRows(): UserAttendanceRow[] {
    return this.attendanceState().data?.data ?? [];
  }

  get activityUsers(): ActivityUserRow[] {
    return this.activityState().data?.user ?? [];
  }

  get activityRows(): ActivityProjectView[] {
    return this.activityUsers.flatMap((user) => {
      const userFullName = this.fullName(user.first_name, user.last_name);

      return (user.project ?? []).map((project) => {
        const percentageValue = this.toPercentage(project.percentage);

        return {
          userFullName,
          username: user.username,
          projectName: project.project_name || 'بدون پروژه',
          serviceName: project.project_service || 'بدون خدمت',
          spentMinutes: project.project_spent_time ?? 0,
          spentLabel: this.formatMinutes(project.project_spent_time),
          percentageText: `${percentageValue.toFixed(0)}٪`,
          percentageValue,
        };
      });
    });
  }

  get attendanceSummary(): AttendanceSummaryView {
    const rows = this.attendanceRows;
    const usersCount = rows.length || 1;

    return {
      usersCount: rows.length,
      presenceMinutes: this.sum(rows, 'presence_summation'),
      totalWorkMinutes: this.sum(rows, 'total_work'),
      expectedMinutes: this.sum(rows, 'expected_time'),
      overtimeMinutes: this.sum(rows, 'overtime_working'),
      averageEfficiency: Math.round(this.sum(rows, 'total_randeman') / usersCount),
      taskDays: this.sum(rows, 'all_task_in_days'),
      lunches: this.sum(rows, 'lunches'),
      noWorkDays: this.sum(rows, 'no_work_days'),
      acceptedVacations: this.sum(rows, 'accepted_vacations'),
      acceptedMissions: this.sum(rows, 'accepted_missions'),
    };
  }

  get dateRangeLabel(): string {
    const attendance = this.attendanceState().data;
    const activity = this.activityState().data;

    const start = attendance?.start ?? activity?.start;
    const end = attendance?.end ?? activity?.end;

    if (!start && !end) return 'بازه انتخاب‌شده';
    if (start === end) return start ?? 'بازه انتخاب‌شده';

    return `${start} تا ${end}`;
  }

  get topActivityProject(): ActivityProjectView | null {
    return [...this.activityRows].sort((a, b) => b.spentMinutes - a.spentMinutes)[0] ?? null;
  }

  get activityTotalMinutes(): number {
    return this.activityRows.reduce((sum, row) => sum + row.spentMinutes, 0);
  }

  get activityTotalLabel(): string {
    return this.formatMinutes(this.activityTotalMinutes);
  }

  get efficiencyMoodLabel(): string {
    const efficiency = this.attendanceSummary.averageEfficiency;

    if (efficiency >= 85) return 'عملکرد عالی';
    if (efficiency >= 60) return 'قابل قبول';
    if (efficiency > 0) return 'نیازمند توجه';
    return 'بدون راندمان ثبت‌شده';
  }

  fullName(firstName?: string, lastName?: string): string {
    return [firstName, lastName].filter(Boolean).join(' ').trim() || '—';
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'full_time':
        return 'تمام وقت';
      case 'part_time':
        return 'پاره وقت';
      case 'contractor':
        return 'قراردادی';
      default:
        return status || '—';
    }
  }

  formatMinutes(minutes: number | null | undefined): string {
    return this.reportsService.formatMinutes(minutes);
  }

  formatSignedMinutes(minutes: number | null | undefined): string {
    return this.reportsService.formatSignedMinutes(minutes);
  }

  overtimeClass(minutes: number | null | undefined): string {
    const value = Number(minutes ?? 0);

    if (value > 0) return 'is-positive';
    if (value < 0) return 'is-negative';
    return 'is-neutral';
  }

  efficiencyClass(value: number | null | undefined): string {
    const efficiency = Number(value ?? 0);

    if (efficiency >= 85) return 'is-positive';
    if (efficiency >= 60) return 'is-warning';
    if (efficiency > 0) return 'is-negative';
    return 'is-neutral';
  }

  availabilityClass(value: number | null | undefined): string {
    const available = Number(value ?? 0);

    if (available > 0) return 'is-positive';
    if (available < 0) return 'is-negative';
    return 'is-neutral';
  }

  prepareAiReport(): void {
    const summary = this.attendanceSummary;
    const topProject = this.topActivityProject;

    this.aiReportPreview.set(
      [
        `پیش‌نویس آماده اتصال به AI برای بازه ${this.dateRangeLabel}`,
        `حضور کل: ${this.formatMinutes(summary.presenceMinutes)}، کارکرد ثبت‌شده: ${this.formatMinutes(summary.totalWorkMinutes)}، انتظار: ${this.formatMinutes(summary.expectedMinutes)}.`,
        `وضعیت اضافه/کسری: ${this.formatSignedMinutes(summary.overtimeMinutes)} و راندمان میانگین ${summary.averageEfficiency}٪ است.`,
        topProject
          ? `بیشترین فعالیت روی پروژه ${topProject.projectName} / ${topProject.serviceName} با ${topProject.spentLabel} و سهم ${topProject.percentageText} بوده است.`
          : 'برای این بازه فعالیت پروژه‌ای ثبت نشده است.',
        'در مرحله بعد، همین داده‌ها به AI Proxy ارسال می‌شوند تا گزارش رسمی/فنی/مدیریتی ساخته شود.',
      ].join('\n'),
    );
  }

  exportActiveCsv(): void {
    if (this.activeTab() === 'attendance') {
      this.exportAttendanceCsv();
      return;
    }

    this.exportActivityCsv();
  }

  exportAttendanceCsv(): void {
    const rows = this.attendanceRows;

    const csvRows = [
      [
        'نام',
        'وضعیت',
        'حضور',
        'کارکرد',
        'انتظار',
        'اضافه/کسری',
        'راندمان',
        'وظایف',
        'مرخصی تاییدشده',
        'ماموریت تاییدشده',
        'ناهار',
      ],
      ...rows.map((row) => [
        this.fullName(row.first_name, row.last_name),
        this.statusLabel(row.status),
        this.formatMinutes(row.presence_summation),
        this.formatMinutes(row.total_work),
        this.formatMinutes(row.expected_time),
        this.formatSignedMinutes(row.overtime_working),
        `${row.total_randeman ?? 0}%`,
        String(row.all_task_in_days ?? 0),
        String(row.accepted_vacations ?? 0),
        String(row.accepted_missions ?? 0),
        String(row.lunches ?? 0),
      ]),
    ];

    this.downloadCsv(csvRows, `wtt-attendance-report-${this.selectedRange()}.csv`);
  }

  exportActivityCsv(): void {
    const rows = this.activityRows;

    const csvRows = [
      ['نام', 'نام کاربری', 'پروژه', 'خدمت', 'زمان', 'درصد'],
      ...rows.map((row) => [
        row.userFullName,
        row.username,
        row.projectName,
        row.serviceName,
        row.spentLabel,
        row.percentageText,
      ]),
    ];

    this.downloadCsv(csvRows, `wtt-activity-report-${this.selectedRange()}.csv`);
  }

  private downloadCsv(rows: string[][], fileName: string): void {
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  private sum(rows: UserAttendanceRow[], key: keyof UserAttendanceRow): number {
    return rows.reduce((total, row) => total + Number(row[key] ?? 0), 0);
  }

  private toPercentage(value: string | number | null | undefined): number {
    const parsed = Number(value ?? 0);

    if (!Number.isFinite(parsed)) return 0;

    return Math.max(0, Math.min(100, parsed));
  }
}
