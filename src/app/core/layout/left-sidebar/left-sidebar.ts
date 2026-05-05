import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout/layout.service'; // ایمپورت سرویس

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  templateUrl: './left-sidebar.html',
})
export class LeftSidebarComponent {
  // تزریق سرویس
  public layout = inject(LayoutService);
}
