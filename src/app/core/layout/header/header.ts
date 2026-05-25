import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../features/dashboard/services/dashboard.service';
import { ThemeService } from '../../services/theme/theme';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  themeService = inject(ThemeService);
  public layout = inject(LayoutService); // فقط سرویس رو اضافه کن

  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  notificationCount = signal(0);
  notificationLoading = signal(false);
  notificationError = signal(false);
  ngOnInit(): void {
    this.loadUnreadNotifications();
  }

  loadUnreadNotifications(): void {
    this.notificationLoading.set(true);
    this.notificationError.set(false);

    this.dashboardService.getUnreadMessages().subscribe({
      next: (response) => {
        this.notificationCount.set(this.extractUnreadCount(response));
        this.notificationLoading.set(false);
      },
      error: () => {
        this.notificationCount.set(0);
        this.notificationError.set(true);
        this.notificationLoading.set(false);
      },
    });
  }

  openNotifications(): void {
    this.router.navigate(['/announcements']);
  }

  private extractUnreadCount(response: unknown): number {
    if (!response || typeof response !== 'object') return 0;

    const data = response as {
      count?: number;
      unread?: number;
      unread_count?: number;
      messages_count?: number;
      data?: {
        count?: number;
        unread?: number;
        unread_count?: number;
        messages_count?: number;
      };
    };

    return Number(
      data.unread_count ??
        data.unread ??
        data.count ??
        data.messages_count ??
        data.data?.unread_count ??
        data.data?.unread ??
        data.data?.count ??
        data.data?.messages_count ??
        0,
    );
  }

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  handleSearchShortcut(event: KeyboardEvent): void {
    const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

    if (!isSearchShortcut) return;

    event.preventDefault();
    this.searchInput?.nativeElement.focus();
    this.searchInput?.nativeElement.select();
  }

  submitSearch(): void {
    this.layout.submitGlobalSearch();
  }
}
