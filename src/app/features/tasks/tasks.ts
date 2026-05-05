import { Component, inject } from '@angular/core';
import { LayoutService } from '../../core/services/layout/layout.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
})
export class TasksComponent {
  layout = inject(LayoutService);

  constructor() {
    // به محض ورود به صفحه وظایف، این رو True کن
    this.layout.isTasksPage.set(true);
  }
}
