import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  authService = inject(AuthService);

  menuItems = [
    { title: 'داشبورد', icon: '📊', route: '/dashboard' },
    { title: 'وظایف', icon: '📋', route: '/tasks' },
    { title: 'حضور', icon: '⏱️', route: '/presence' },
    { title: 'گزارش ها', icon: '📈', route: '/reports' },
  ];
}
