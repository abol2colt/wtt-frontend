import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { ApiState } from '../../shared/models/api-state.model';
import { NewsMessagesResponse } from '../../shared/models/dashboard.model';
import { TaskRange } from '../../shared/models/task.model';

type AnnouncementTab = 'public' | 'private';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './announcements.html',
})
export class AnnouncementsComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  activeTab = signal<AnnouncementTab>('public');
  selectedRange = signal<TaskRange>('month_till_today');

  announcementsState = signal<ApiState<NewsMessagesResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  setTab(tab: AnnouncementTab): void {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementsState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.dashboardService.getNewsMessages(this.activeTab(), this.selectedRange()).subscribe({
      next: (response) => {
        this.announcementsState.set({
          data: response,
          loading: false,
          error: null,
        });
      },
      error: () => {
        this.announcementsState.set({
          data: null,
          loading: false,
          error: 'خطا در دریافت اطلاعیه‌ها',
        });
      },
    });
  }

  get tabTitle(): string {
    return this.activeTab() === 'public' ? 'اطلاعیه‌های عمومی' : 'اطلاعیه‌های شخصی';
  }
}
