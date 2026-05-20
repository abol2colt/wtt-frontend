import { Injectable, signal } from '@angular/core';
import { TaskRange } from '../../../shared/models/task.model';
import { RequestRange } from '../../../shared/models/presence.model';
import { ReportRange, ReportsTab } from '../../../shared/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly welcomeSplashSeenKey = 'wtt_welcome_splash_seen';

  public isTasksPage = signal<boolean>(false);
  public isCollapsed = signal<boolean>(false);
  public isMobileSidebarOpen = signal<boolean>(false);
  public isFilterPanelOpen = signal<boolean>(false);

  public toggleFilterPanel(): void {
    this.isFilterPanelOpen.update((isOpen) => !isOpen);
  }
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

  applyPresenceFilters(): void {
    // فیلترها فعلاً reactive هستند.
  }

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
}
