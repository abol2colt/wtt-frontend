import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TaskRange } from '../../../shared/models/task.model';
import { RequestRange } from '../../../shared/models/presence.model';
import { ReportRange, ReportsTab } from '../../../shared/models/report.model';
export type AppPageKey =
  | 'dashboard'
  | 'tasks'
  | 'task-detail'
  | 'presence'
  | 'reports'
  | 'settings'
  | 'announcements'
  | 'unknown';

export type GlobalSearchScope = 'current_page' | 'entire_app';
export interface GlobalSearchRequest {
  query: string;
  scope: GlobalSearchScope;
  pageKey: AppPageKey;
  submittedAt: number;
}
export interface AppPageMeta {
  key: AppPageKey;
  title: string;
  subtitle: string;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly welcomeSplashSeenKey = 'wtt_welcome_splash_seen';
  private readonly router = inject(Router);

  public currentPage = signal<AppPageMeta>({
    key: 'dashboard',
    title: 'داشبورد',
    subtitle: 'نمای کلی از عملکرد و فعالیت‌های شما',
  });

  public isDashboardPage = signal<boolean>(true);
  public isSettingsPage = signal<boolean>(false);
  public isAnnouncementsPage = signal<boolean>(false);
  public isTasksPage = signal<boolean>(false);
  public isCollapsed = signal<boolean>(false);
  public isMobileSidebarOpen = signal<boolean>(false);
  public isFilterPanelOpen = signal<boolean>(false);
  public searchQuery = signal('');
  public searchScope = signal<GlobalSearchScope>('current_page');
  public searchSubmitKey = signal(0);
  public isSearchFocused = signal(false);
  public lastSearchSummary = signal('');
  public searchRequest = signal<GlobalSearchRequest | null>(null);
  public isWelcomeSplashVisible = signal<boolean>(false);
  dashboardRange = signal<TaskRange>('month_till_today');
  public isPresencePage = signal<boolean>(false);
  public isReportsPage = signal<boolean>(false);
  public reportsRange = signal<ReportRange>('month_till_today');
  public reportsTab = signal<ReportsTab>('attendance');
  public presenceRange = signal<RequestRange>('month_till_today');
  public presenceRequestTab = signal<'all' | 'leave' | 'mission'>('all');
  public presenceStatus = signal<'all' | 'approved' | 'pending' | 'rejected'>('all');
  reportsAiActionKey = signal(0);

  constructor() {
    this.setCurrentPageFromUrl(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setCurrentPageFromUrl(event.urlAfterRedirects);
      });
  }
  setCurrentPageFromUrl(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const page = this.resolvePageMeta(cleanUrl);

    this.currentPage.set(page);

    this.isDashboardPage.set(page.key === 'dashboard');
    this.isTasksPage.set(page.key === 'tasks' || page.key === 'task-detail');
    this.isPresencePage.set(page.key === 'presence');
    this.isReportsPage.set(page.key === 'reports');
    this.isSettingsPage.set(page.key === 'settings');
    this.isAnnouncementsPage.set(page.key === 'announcements');

    this.isFilterPanelOpen.set(false);
  }

  shouldShowLeftSidebarStats(): boolean {
    return this.isDashboardPage() || this.isTasksPage() || this.isPresencePage();
  }

  private resolvePageMeta(url: string): AppPageMeta {
    if (url.startsWith('/tasks/')) {
      return {
        key: 'task-detail',
        title: 'جزئیات وظیفه',
        subtitle: 'بررسی کامل اطلاعات، زمان و وضعیت کارکرد',
      };
    }

    if (url.startsWith('/tasks')) {
      return {
        key: 'tasks',
        title: 'مرکز وظایف',
        subtitle: 'بررسی، ثبت و پیگیری تسک‌های روزانه',
      };
    }

    if (url.startsWith('/reports')) {
      return {
        key: 'reports',
        title: 'مرکز گزارش‌ها',
        subtitle: 'گزارش حضور، کارکرد و عملکرد پروژه‌ها',
      };
    }

    if (url.startsWith('/settings')) {
      return {
        key: 'settings',
        title: 'مرکز تنظیمات',
        subtitle: 'تنظیمات پروفایل، ترجیحات AI، ظاهر و اتصال‌ها',
      };
    }

    if (url.startsWith('/presence')) {
      return {
        key: 'presence',
        title: 'ماموریت و مرخصی',
        subtitle: 'مدیریت درخواست‌های حضور، ماموریت و مرخصی',
      };
    }

    if (url.startsWith('/announcements')) {
      return {
        key: 'announcements',
        title: 'مرکز اطلاعیه‌ها',
        subtitle: 'مشاهده اطلاعیه‌های عمومی و شخصی',
      };
    }

    return {
      key: 'dashboard',
      title: 'داشبورد',
      subtitle: 'نمای کلی از عملکرد و فعالیت‌های شما',
    };
  }

  public toggleFilterPanel(): void {
    this.isFilterPanelOpen.update((isOpen) => !isOpen);
  }

  isSearchPanelOpen(): boolean {
    return this.isSearchFocused() || this.searchQuery().trim().length > 0;
  }

  hasActiveSearch(): boolean {
    return this.searchQuery().trim().length > 0;
  }
  private publishSearchRequest(): void {
    const query = this.searchQuery().trim();

    if (!query) {
      this.searchRequest.set(null);
      this.lastSearchSummary.set('');
      return;
    }

    const request: GlobalSearchRequest = {
      query,
      scope: this.searchScope(),
      pageKey: this.currentPage().key,
      submittedAt: Date.now(),
    };

    const scopeLabel = request.scope === 'current_page' ? this.currentPage().title : 'کل سامانه';

    this.searchRequest.set(request);
    this.lastSearchSummary.set(`جستجو برای «${query}» در ${scopeLabel}`);
    this.searchSubmitKey.update((value) => value + 1);
  }
  triggerReportsAiAction(): void {
    this.reportsAiActionKey.update((value) => value + 1);
  }

  setReportsRange(range: ReportRange): void {
    this.reportsRange.set(range);
  }

  setReportsTab(tab: ReportsTab): void {
    this.reportsTab.set(tab);
  }

  resetReportsFilters(): void {
    this.reportsRange.set('month_till_today');
    this.reportsTab.set('attendance');
  }

  setPresenceRange(range: RequestRange): void {
    this.presenceRange.set(range);
  }

  setPresenceRequestTab(tab: 'all' | 'leave' | 'mission'): void {
    this.presenceRequestTab.set(tab);
  }

  setPresenceStatus(status: 'all' | 'approved' | 'pending' | 'rejected'): void {
    this.presenceStatus.set(status);
  }

  applyPresenceFilters(): void {}

  resetPresenceFilters(): void {
    this.presenceRange.set('month_till_today');
    this.presenceRequestTab.set('all');
    this.presenceStatus.set('all');
  }

  private readonly leftSidebarCollapsed = signal(false);

  readonly isLeftSidebarCollapsed = this.leftSidebarCollapsed.asReadonly();

  toggleLeftSidebar(): void {
    this.leftSidebarCollapsed.update((value) => !value);
  }

  collapseLeftSidebar(): void {
    this.leftSidebarCollapsed.set(true);
  }

  expandLeftSidebar(): void {
    this.leftSidebarCollapsed.set(false);
  }

  toggleSidebar(): void {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  showWelcomeSplashOnce(): void {
    if (sessionStorage.getItem(this.welcomeSplashSeenKey) === 'true') {
      return;
    }

    sessionStorage.setItem(this.welcomeSplashSeenKey, 'true');
    this.isWelcomeSplashVisible.set(true);
  }

  dismissWelcomeSplash(): void {
    this.isWelcomeSplashVisible.set(false);
  }

  resetWelcomeSplash(): void {
    sessionStorage.removeItem(this.welcomeSplashSeenKey);
    this.isWelcomeSplashVisible.set(false);
  }
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.publishSearchRequest();
  }

  setSearchScope(scope: GlobalSearchScope): void {
    this.searchScope.set(scope);
    this.publishSearchRequest();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.lastSearchSummary.set('');
    this.searchRequest.set(null);
  }

  submitGlobalSearch(): void {
    this.publishSearchRequest();
  }
}
