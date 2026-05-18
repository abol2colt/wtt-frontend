import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TasksComponent } from './features/tasks/tasks';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail';
import { LoginComponent } from './features/auth/login/login';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ReportsComponent } from './features/reports/reports';
import { SettingsComponent } from './features/settings/settings';
import { authGuard } from './core/guards/auth.guard';
import { AnnouncementsComponent } from './features/announcements/announcements';
import { PresenceComponent } from './features/presence/presence';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

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
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },

  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'presence',
    component: PresenceComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'dashboard' },
];
