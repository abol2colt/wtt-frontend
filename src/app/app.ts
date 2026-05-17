import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './core/layout/header/header'; // <-- این خط اضافه شود
import { SidebarComponent } from './core/layout/sidebar/sidebar';
import { LeftSidebarComponent } from './core/layout/left-sidebar/left-sidebar';
import { LayoutService } from './core/services/layout/layout.service';
import { WelcomeSplashComponent } from './core/layout/welcome-splash/welcome-splash';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    LeftSidebarComponent,
    WelcomeSplashComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  readonly layout = inject(LayoutService);
  readonly isAuthRoute = signal(this.isAuthUrl(this.router.url));

  title = 'wtt-frontend';

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.isAuthRoute.set(this.isAuthUrl(event.urlAfterRedirects));
      this.layout.closeMobileSidebar();
    });
  }

  private isAuthUrl(url: string): boolean {
    return url === '/' || url.startsWith('/auth');
  }
}
