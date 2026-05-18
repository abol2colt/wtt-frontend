import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LayoutService } from '../../services/layout/layout.service';
import { TasksService } from '../../../features/tasks/services/tasks.service';

@Component({
  selector: 'app-welcome-splash',
  standalone: true,
  templateUrl: './welcome-splash.html',
})
export class WelcomeSplashComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly layout = inject(LayoutService);
  private readonly tasksService = inject(TasksService);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly todayTaskCount = signal<number | null>(null);
  readonly correctionNeededCount = signal<number | null>(null);

  readonly userName = computed(() => {
    const user = this.authService.currentUser();
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();

    return fullName || user?.username || 'همکار عزیز';
  });

  readonly greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'صبح بخیر';
    if (hour < 17) return 'روز بخیر';
    return 'عصر بخیر';
  });

  ngOnInit(): void {
    this.tasksService.getTasksCount({ range: 'today' }).subscribe({
      next: (count) => {
        this.todayTaskCount.set(count.all ?? 0);
        this.correctionNeededCount.set(count.reject ?? 0);
      },
      error: () => {
        this.todayTaskCount.set(null);
        this.correctionNeededCount.set(null);
      },
    });

    this.dismissTimer = setTimeout(() => {
      this.dismiss();
    }, 4200);
  }

  ngOnDestroy(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
  }

  dismiss(): void {
    this.layout.dismissWelcomeSplash();
  }
}
