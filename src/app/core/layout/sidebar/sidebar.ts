import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);

  public readonly authService = inject(AuthService);
  public readonly layout = inject(LayoutService);

  readonly avatarFailed = signal(false);

  constructor() {
    if (this.authService.isAuthenticated() && !this.authService.currentUser()) {
      this.authService.fetchProfile().subscribe({
        error: () => {
          // Sidebar should keep fallback state if profile request fails.
        },
      });
    }
  }
  get currentUser() {
    return this.authService.currentUser();
  }

  get userFullName(): string {
    const user = this.currentUser;

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();

    return fullName || user?.username || 'User';
  }

  get userRoleLabel(): string {
    const role = this.currentUser?.role ?? this.currentUser?.workflow?.brand;

    if (!role) {
      return 'Developer';
    }

    return role === 'developer' ? 'Developer' : role;
  }

  get userInitials(): string {
    const user = this.currentUser;

    const firstInitial = user?.first_name?.trim()?.charAt(0) ?? '';
    const lastInitial = user?.last_name?.trim()?.charAt(0) ?? '';

    const initials = `${firstInitial}${lastInitial}`.trim();

    if (initials) {
      return initials;
    }

    return user?.username?.slice(0, 2).toUpperCase() ?? 'WT';
  }

  userAvatarUrl(): string | null {
    if (this.avatarFailed()) {
      return null;
    }

    const avatar = this.currentUser?.avatar?.trim();

    if (!avatar) {
      return null;
    }

    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }

    return `/wtt-api/api/v1/media_download/${avatar}/`;
  }

  onAvatarError(): void {
    this.avatarFailed.set(true);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
