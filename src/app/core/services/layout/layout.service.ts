import { Injectable, signal } from '@angular/core';
import { TaskRange } from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public isTasksPage = signal<boolean>(false);
  dashboardRange = signal<TaskRange>('month_till_today');
}
