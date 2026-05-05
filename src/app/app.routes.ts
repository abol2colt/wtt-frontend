import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TasksComponent } from './features/tasks/tasks';
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TasksComponent },
];
