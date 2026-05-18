import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  public readonly layout = inject(LayoutService);

  logout(): void {
    // Clear local auth state and return the user to the login page.
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
