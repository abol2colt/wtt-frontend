import { Component, signal } from '@angular/core';

type RequestTab = 'leave' | 'mission';
type RequestStatus = 'approved' | 'pending' | 'rejected';

interface RequestRow {
  id: number;
  type: RequestTab;
  title: string;
  date: string;
  duration: string;
  status: RequestStatus;
  approver?: string; // اضافه شدن تاییدکننده برای نمایش در آواتار
}

@Component({
  selector: 'app-presence',
  standalone: true,
  templateUrl: './presence.html',
})
export class PresenceComponent {
  activeTab = signal<RequestTab>('leave');

  readonly requests: RequestRow[] = [
    {
      id: 1,
      type: 'leave',
      title: 'مرخصی ساعتی',
      date: '1405/02/28',
      duration: '2 ساعت',
      status: 'pending',
      approver: 'سعید',
    },
    {
      id: 2,
      type: 'mission',
      title: 'ماموریت جلسه با کارفرما',
      date: '1405/02/27',
      duration: 'نیم‌روز',
      status: 'approved',
      approver: 'مهدی',
    },
  ];

  get filteredRequests(): RequestRow[] {
    return this.requests.filter((item) => item.type === this.activeTab());
  }

  setTab(tab: RequestTab): void {
    this.activeTab.set(tab);
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

  get leaveCount(): number {
    return this.requests.filter((item) => item.type === 'leave').length;
  }

  get missionCount(): number {
    return this.requests.filter((item) => item.type === 'mission').length;
  }
}
