import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TasksComponent } from './features/tasks/tasks';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [authGuard],
  },
];
