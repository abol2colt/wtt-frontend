import { Component, OnDestroy, OnInit, effect, inject, signal, untracked } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LayoutService } from '../../core/services/layout/layout.service';
import {
  MissionRequest,
  RequestRange,
  RequestsCountResponse,
  VacationCreatePayload,
  VacationRequest,
  VacationType,
} from '../../shared/models/presence.model';
import { PresenceService } from './services/presence.service';

type RequestTab = 'all' | 'leave' | 'mission';
type RequestStatus = 'approved' | 'pending' | 'rejected';
type CreateRequestType = 'leave' | 'mission';

interface VacationCreateForm {
  vacation_type: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface MissionCreateForm {
  title: string;
  start_date: string;
  end_date: string;
  mission_type: string;
  job_position: string;
  workplace: string;
  destination: string;
  go_vehicle: string;
  return_vehicle: string;
  project: string;
  service_type: string;
  customer: string;
  description: string;
}

interface RequestRow {
  id: number;
  type: RequestTab;
  title: string;
  date: string;
  duration: string;
  status: RequestStatus;
  approver?: string;
  editable?: boolean;
  raw: VacationRequest | MissionRequest;
}

@Component({
  selector: 'app-presence',
  standalone: true,
  templateUrl: './presence.html',
})
export class PresenceComponent implements OnInit, OnDestroy {
  private readonly presenceService = inject(PresenceService);
  readonly layout = inject(LayoutService);

  activeTab = this.layout.presenceRequestTab;
  selectedRange = this.layout.presenceRange;

  loading = signal(true);
  error = signal<string | null>(null);

  vacationRows = signal<RequestRow[]>([]);
  missionRows = signal<RequestRow[]>([]);

  vacationCount = signal<RequestsCountResponse | null>(null);
  missionCountState = signal<RequestsCountResponse | null>(null);
  vacationTypes = signal<VacationType[]>([]);

  selectedRequest = signal<RequestRow | null>(null);

  createRequestType = signal<CreateRequestType | null>(null);
  createRequestLoading = signal(false);
  createRequestError = signal<string | null>(null);
  createRequestSuccess = signal<string | null>(null);

  vacationForm = signal<VacationCreateForm>({
    vacation_type: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  missionForm = signal<MissionCreateForm>({
    title: '',
    start_date: '',
    end_date: '',
    mission_type: '',
    job_position: '',
    workplace: '',
    destination: '',
    go_vehicle: '',
    return_vehicle: '',
    project: '',
    service_type: '',
    customer: '',
    description: '',
  });

  readonly ranges: { key: RequestRange; label: string }[] = [
    { key: 'month_till_today', label: 'ماه جاری تا امروز' },
    { key: 'month', label: 'ماه جاری' },
    { key: 'last_month', label: 'ماه گذشته' },
    { key: 'today', label: 'امروز' },
    { key: 'yesterday', label: 'دیروز' },
    { key: 'week', label: 'هفته جاری' },
    { key: 'this_year', label: 'سال جاری' },
  ];

  constructor() {
    this.layout.isTasksPage.set(false);
    this.layout.isPresencePage.set(true);

    effect(() => {
      this.layout.presenceRange();

      untracked(() => {
        this.loadPresenceRequests();
      });
    });
  }

  ngOnInit(): void {
    this.loadVacationTypes();
  }

  ngOnDestroy(): void {
    this.layout.isPresencePage.set(false);
  }

  get requests(): RequestRow[] {
    return [...this.vacationRows(), ...this.missionRows()];
  }

  get filteredRequests(): RequestRow[] {
    const tab = this.layout.presenceRequestTab();
    const status = this.layout.presenceStatus();

    const rows =
      tab === 'leave'
        ? this.vacationRows()
        : tab === 'mission'
          ? this.missionRows()
          : this.requests;

    if (status === 'all') {
      return rows;
    }

    return rows.filter((row) => row.status === status);
  }

  get leaveCount(): number {
    return this.vacationCount()?.all ?? this.vacationRows().length;
  }

  get missionCount(): number {
    return this.missionCountState()?.all ?? this.missionRows().length;
  }

  get openRequestsCount(): number {
    return (this.vacationCount()?.pending ?? 0) + (this.missionCountState()?.pending ?? 0);
  }

  get approvedRequestsCount(): number {
    return (this.vacationCount()?.accept ?? 0) + (this.missionCountState()?.accept ?? 0);
  }

  get rejectedRequestsCount(): number {
    return (this.vacationCount()?.reject ?? 0) + (this.missionCountState()?.reject ?? 0);
  }

  get selectedVacationType(): VacationType | null {
    return (
      this.vacationTypes().find((type) => type.value === this.vacationForm().vacation_type) ?? null
    );
  }

  get shouldShowVacationEndDate(): boolean {
    return Boolean(this.selectedVacationType?.range);
  }

  get canSubmitVacationRequest(): boolean {
    const form = this.vacationForm();

    return Boolean(form.vacation_type && form.start_date.trim() && form.description.trim());
  }

  get canSubmitMissionRequest(): boolean {
    const form = this.missionForm();

    return Boolean(form.title.trim() && form.start_date.trim() && form.destination.trim());
  }

  get canSubmitCreateRequest(): boolean {
    const requestType = this.createRequestType();

    if (!requestType) {
      return false;
    }

    return requestType === 'leave' ? this.canSubmitVacationRequest : this.canSubmitMissionRequest;
  }

  get selectedRequestDetails(): { label: string; value: string }[] {
    const request = this.selectedRequest();

    if (!request) {
      return [];
    }

    if (request.type === 'leave') {
      const item = request.raw as VacationRequest;

      return [
        { label: 'نوع درخواست', value: 'مرخصی' },
        { label: 'نوع مرخصی', value: item.vacation_type?.key || request.title },
        { label: 'تاریخ شروع', value: item.start_date || '—' },
        { label: 'تاریخ پایان', value: item.end_date || '—' },
        { label: 'وضعیت مدیر', value: this.rawStatusLabel(item.status) },
        { label: 'وضعیت منابع انسانی', value: this.rawStatusLabel(item.hr_verification_status) },
        { label: 'تاییدکننده', value: this.personName(item.verified_by) },
        { label: 'تاریخ تایید', value: item.verified_date || '—' },
        {
          label: 'توضیح',
          value: item.vacation_type_comment || item.comment || item.description || '—',
        },
        { label: 'قابل ویرایش', value: item.editable ? 'بله' : 'خیر' },
      ];
    }

    const item = request.raw as MissionRequest;

    return [
      { label: 'نوع درخواست', value: 'ماموریت' },
      { label: 'عنوان', value: item.title || request.title },
      { label: 'پروژه', value: item.project?.title || '—' },
      { label: 'قرارداد', value: item.project_contract?.contract || '—' },
      { label: 'خدمت', value: item.project_service?.service || '—' },
      { label: 'تاریخ شروع', value: item.start_date || item.date || '—' },
      { label: 'تاریخ پایان', value: item.end_date || '—' },
      { label: 'محل ماموریت', value: item.location || '—' },
      { label: 'وسیله رفت', value: this.vehicleLabel(item.go) },
      { label: 'وسیله برگشت', value: this.vehicleLabel(item.back) },
      { label: 'وضعیت', value: this.rawStatusLabel(item.status) },
      { label: 'تاییدکننده', value: this.personName(item.verified_by) },
      { label: 'توضیح', value: item.description || '—' },
      { label: 'قابل ویرایش', value: item.editable ? 'بله' : 'خیر' },
    ];
  }

  setTab(tab: RequestTab): void {
    this.layout.setPresenceRequestTab(tab);
  }

  setRange(range: RequestRange): void {
    if (this.selectedRange() === range) {
      return;
    }

    this.layout.setPresenceRange(range);
  }

  loadPresenceRequests(): void {
    this.loading.set(true);
    this.error.set(null);

    const range = this.selectedRange();

    forkJoin({
      vacationCount: this.presenceService.getVacationsCount(range),
      missionCount: this.presenceService.getMissionsCount(range),
      vacations: this.presenceService.getVacations(range),
      missions: this.presenceService.getMissions(range),
    }).subscribe({
      next: ({ vacationCount, missionCount, vacations, missions }) => {
        this.vacationCount.set(vacationCount);
        this.missionCountState.set(missionCount);

        this.vacationRows.set(vacations.results.map((item) => this.mapVacationToRow(item)));
        this.missionRows.set(missions.results.map((item) => this.mapMissionToRow(item)));

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('خطا در دریافت درخواست‌های ماموریت و مرخصی');
      },
    });
  }

  loadVacationTypes(): void {
    this.presenceService.getVacationTypes().subscribe({
      next: (types) => {
        this.vacationTypes.set(types);

        if (!this.vacationForm().vacation_type && types[0]) {
          this.updateVacationForm({ vacation_type: types[0].value });
        }
      },
      error: () => this.vacationTypes.set([]),
    });
  }

  openRequestDetails(request: RequestRow): void {
    this.selectedRequest.set(request);
  }

  closeRequestDetails(): void {
    this.selectedRequest.set(null);
  }

  openCreateRequest(type: CreateRequestType): void {
    this.createRequestError.set(null);
    this.createRequestSuccess.set(null);
    this.createRequestType.set(type);

    if (type === 'leave' && !this.vacationForm().vacation_type) {
      const firstType = this.vacationTypes()[0];

      if (firstType) {
        this.updateVacationForm({ vacation_type: firstType.value });
      }
    }
  }

  closeCreateRequest(): void {
    if (this.createRequestLoading()) {
      return;
    }

    this.createRequestType.set(null);
    this.createRequestError.set(null);
    this.createRequestSuccess.set(null);
  }

  updateVacationForm(patch: Partial<VacationCreateForm>): void {
    this.vacationForm.update((form) => ({
      ...form,
      ...patch,
    }));
  }

  updateMissionForm(patch: Partial<MissionCreateForm>): void {
    this.missionForm.update((form) => ({
      ...form,
      ...patch,
    }));
  }

  submitVacationRequest(): void {
    const form = this.vacationForm();

    if (!this.canSubmitVacationRequest) {
      this.createRequestError.set('نوع مرخصی، تاریخ شروع و توضیح را کامل کن.');
      return;
    }

    this.createRequestLoading.set(true);
    this.createRequestError.set(null);
    this.createRequestSuccess.set(null);

    const payload: VacationCreatePayload = {
      start_date: form.start_date.trim(),
      description: form.description.trim(),
      vacation_type: form.vacation_type,
      ...(this.shouldShowVacationEndDate && form.end_date.trim()
        ? { end_date: form.end_date.trim() }
        : {}),
    };

    this.presenceService.createVacation(payload).subscribe({
      next: () => {
        this.createRequestLoading.set(false);
        this.createRequestSuccess.set('درخواست مرخصی با موفقیت ثبت شد.');
        this.resetVacationForm();
        this.closeCreateRequest();
        this.loadPresenceRequests();
      },
      error: (error) => {
        this.createRequestLoading.set(false);
        this.createRequestError.set(this.extractPresenceError(error, 'ثبت مرخصی ناموفق بود.'));
      },
    });
  }

  submitMissionRequest(): void {
    this.createRequestError.set(
      'برای ثبت واقعی ماموریت، Request Payload مربوط به POST /api/v1/mission/ هنوز لازم است.',
    );
  }

  statusLabel(status: RequestStatus): string {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'pending':
        return 'در انتظار بررسی';
      case 'rejected':
        return 'رد شده';
    }
  }

  statusClass(status: RequestStatus): string {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 ring-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-500 ring-rose-500/20';
    }
  }

  private resetVacationForm(): void {
    this.vacationForm.set({
      vacation_type: this.vacationTypes()[0]?.value ?? '',
      start_date: '',
      end_date: '',
      description: '',
    });
  }

  private mapVacationToRow(item: VacationRequest): RequestRow {
    return {
      id: item.id,
      type: 'leave',
      title: item.vacation_type?.key || item.description || 'مرخصی',
      date: this.formatDateRange(item.start_date, item.end_date),
      duration: item.range ? 'بازه چندروزه' : 'یک روز / ساعتی',
      status: this.mapStatus(item.status),
      approver: item.verified_by
        ? `${item.verified_by.first_name?.charAt(0) ?? ''}${item.verified_by.last_name?.charAt(0) ?? ''}`
        : '—',
      editable: item.editable,
      raw: item,
    };
  }

  private mapMissionToRow(item: MissionRequest): RequestRow {
    return {
      id: item.id,
      type: 'mission',
      title: item.title || item.description || 'ماموریت',
      date: this.formatDateRange(item.start_date || item.date, item.end_date),
      duration: item.type === 'single' ? 'ماموریت روزانه' : item.end_date ? 'بازه ماموریت' : 'ماموریت',
      status: this.mapStatus(item.status),
      approver: item.verified_by
        ? `${item.verified_by.first_name?.charAt(0) ?? ''}${item.verified_by.last_name?.charAt(0) ?? ''}`
        : '—',
      editable: item.editable,
      raw: item,
    };
  }

  private mapStatus(status: unknown): RequestStatus {
    switch (status) {
      case 'accept':
      case 'approved':
        return 'approved';
      case 'reject':
      case 'rejected':
        return 'rejected';
      case 'pending':
      default:
        return 'pending';
    }
  }

  private formatDateRange(start?: string, end?: string | null): string {
    if (!start && !end) return 'بدون تاریخ';
    if (!end || end === start) return start ?? 'بدون تاریخ';

    return `${start} تا ${end}`;
  }

  private personName(person?: { first_name?: string; last_name?: string } | null): string {
    if (!person) {
      return '—';
    }

    return [person.first_name, person.last_name].filter(Boolean).join(' ').trim() || '—';
  }

  private rawStatusLabel(status: unknown): string {
    switch (status) {
      case 'accept':
      case 'approved':
        return 'تایید شده';
      case 'reject':
      case 'rejected':
        return 'رد شده';
      case 'pending':
        return 'در انتظار بررسی';
      default:
        return status ? String(status) : '—';
    }
  }

  private vehicleLabel(vehicle?: string): string {
    switch (vehicle) {
      case 'car_with_driver':
        return 'خودرو با راننده';
      case 'car_without_driver':
        return 'خودرو بدون راننده';
      case 'personal_car':
        return 'خودروی شخصی';
      case 'taxi':
        return 'تاکسی';
      default:
        return vehicle || '—';
    }
  }

  private extractPresenceError(error: unknown, fallback: string): string {
    const apiError = error as {
      error?: string | string[] | Record<string, string[] | string>;
      message?: string;
    };

    if (typeof apiError.error === 'string') {
      return apiError.error;
    }

    if (Array.isArray(apiError.error)) {
      return apiError.error.join('، ');
    }

    if (apiError.error && typeof apiError.error === 'object') {
      return Object.entries(apiError.error)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join('، ') : value}`)
        .join(' | ');
    }

    return apiError.message || fallback;
  }
}
