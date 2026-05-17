import { Injectable, signal } from '@angular/core';
import { TaskRange } from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly welcomeSplashSeenKey = 'wtt_welcome_splash_seen';

  public isTasksPage = signal<boolean>(false);
  public isCollapsed = signal<boolean>(false);
  public isMobileSidebarOpen = signal<boolean>(false);
  public isFilterPanelOpen = signal<boolean>(true);
  public isWelcomeSplashVisible = signal<boolean>(false);

  dashboardRange = signal<TaskRange>('month_till_today');

  toggleSidebar(): void {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen.update((isOpen) => !isOpen);
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
