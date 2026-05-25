import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IntegrationSettingsService } from './services/integration-settings.service';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../../core/services/layout/layout.service';
import {
  AiDetailLevel,
  AiTone,
  AnimationLevel,
  DashboardDensity,
  ReportLanguage,
  UiAccent,
  UserPreferencesService,
} from './services/user-preferences.service';

type SettingsTab = 'profile' | 'ai' | 'ui' | 'integrations' | 'security';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  readonly preferencesService = inject(UserPreferencesService);
  private readonly layout = inject(LayoutService);

  readonly activeTab = signal<SettingsTab>('profile');

  private readonly fb = inject(FormBuilder);
  private readonly integrationSettingsService = inject(IntegrationSettingsService);
  readonly enableRealTaskMutation = environment.enableRealTaskMutation;
  readonly enableRealPresenceMutation = environment.enableRealPresenceMutation;
  readonly jiraBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly gitlabBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly disabledConnectionTooltip =
    'در دمو امن، تست اتصال غیرفعال است و هیچ توکن یا درخواست واقعی از مرورگر ارسال نمی‌شود.';

  readonly integrationStatus = signal<string>('در حال بررسی...');
  readonly jiraTestMessage = signal<string | null>(null);
  readonly gitlabTestMessage = signal<string | null>(null);
  readonly integrationLoading = signal(false);

  readonly jiraForm = this.fb.nonNullable.group({
    baseUrl: ['', [Validators.required]],
    email: ['', [Validators.required]],
    token: ['', [Validators.required]],
    authType: ['bearer'],
    apiVersion: ['2'],
    jql: ['statusCategory != Done ORDER BY updated DESC'],
  });

  readonly gitlabForm = this.fb.nonNullable.group({
    baseUrl: ['', [Validators.required]],
    token: ['', [Validators.required]],
    username: [''],
    projectId: ['', [Validators.required]],
    branchPattern: ['feature/{TASK_KEY}'],
  });

  readonly tabs: { id: SettingsTab; label: string; eyebrow: string }[] = [
    { id: 'profile', label: 'Profile', eyebrow: 'پروفایل' },
    { id: 'ai', label: 'AI Preferences', eyebrow: 'ترجیحات AI' },
    { id: 'ui', label: 'UI Personalization', eyebrow: 'شخصی‌سازی' },
    { id: 'integrations', label: 'Integrations', eyebrow: 'اتصال‌ها' },
    { id: 'security', label: 'Security', eyebrow: 'امنیت' },
  ];

  readonly aiToneOptions: { value: AiTone; label: string; description: string }[] = [
    { value: 'formal', label: 'رسمی', description: 'مناسب گزارش‌های اداری و مکاتبه‌ای' },
    { value: 'technical', label: 'فنی', description: 'متمرکز بر جزئیات فنی و شواهد کاری' },
    { value: 'managerial', label: 'مدیریتی', description: 'خلاصه‌تر و مناسب مرور مدیریتی' },
  ];

  readonly detailLevelOptions: { value: AiDetailLevel; label: string }[] = [
    { value: 'short', label: 'خلاصه' },
    { value: 'balanced', label: 'متعادل' },
    { value: 'detailed', label: 'کامل' },
  ];

  readonly reportLanguageOptions: { value: ReportLanguage; label: string }[] = [
    { value: 'fa', label: 'فارسی' },
    { value: 'en', label: 'English' },
    { value: 'bilingual', label: 'دو زبانه' },
  ];

  readonly accentOptions: { value: UiAccent; label: string; className: string }[] = [
    { value: 'violet', label: 'Violet', className: 'bg-violet-500' },
    { value: 'cyan', label: 'Cyan', className: 'bg-cyan-500' },
    { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
    { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
    { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
  ];

  readonly animationLevelOptions: { value: AnimationLevel; label: string }[] = [
    { value: 'off', label: 'خاموش' },
    { value: 'subtle', label: 'ملایم' },
    { value: 'vivid', label: 'پررنگ' },
  ];

  readonly dashboardDensityOptions: { value: DashboardDensity; label: string }[] = [
    { value: 'comfortable', label: 'راحت' },
    { value: 'compact', label: 'فشرده' },
  ];
  ngOnInit(): void {
    this.loadIntegrationStatus();
  }

  loadIntegrationStatus(): void {
    this.integrationSettingsService.getStatus().subscribe({
      next: (status) => {
        this.integrationStatus.set(
          `Jira: ${status.jira.mode} | GitLab: ${status.gitlab.mode} | AI: ${status.ai.mode}`,
        );
      },
      error: (error) => {
        this.integrationStatus.set(error.message);
      },
    });
  }
  setActiveTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  tabButtonClass(tab: SettingsTab): string {
    const isActive = this.activeTab() === tab;

    return [
      'flex min-w-[150px] flex-1 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-right transition',
      isActive
        ? 'bg-[var(--text-main)] text-white shadow-sm dark:bg-white dark:text-slate-950'
        : 'bg-slate-50 text-[var(--text-soft)] ring-1 ring-slate-200 hover:text-[var(--text-main)] dark:bg-white/5 dark:ring-white/10',
    ].join(' ');
  }

  optionButtonClass(isActive: boolean): string {
    return [
      'rounded-2xl px-4 py-3 text-right text-xs font-black transition ring-1',
      isActive
        ? 'bg-cyan-500/10 text-cyan-600 ring-cyan-500/30 dark:text-cyan-300'
        : 'bg-white text-[var(--text-soft)] ring-slate-200 hover:text-[var(--text-main)] dark:bg-slate-950/40 dark:ring-white/10',
    ].join(' ');
  }

  setAiTone(value: AiTone): void {
    this.preferencesService.setAiTone(value);
  }

  setAiDetailLevel(value: AiDetailLevel): void {
    this.preferencesService.setAiDetailLevel(value);
  }

  setReportLanguage(value: ReportLanguage): void {
    this.preferencesService.setReportLanguage(value);
  }

  setUiAccent(value: UiAccent): void {
    this.preferencesService.setUiAccent(value);
  }

  setAnimationLevel(value: AnimationLevel): void {
    this.preferencesService.setAnimationLevel(value);
  }

  setDashboardDensity(value: DashboardDensity): void {
    this.preferencesService.setDashboardDensity(value);
  }
  testJiraConnection(): void {
    if (this.jiraForm.invalid) {
      this.jiraForm.markAllAsTouched();
      return;
    }

    this.jiraTestMessage.set('در حال تست Jira...');

    this.integrationSettingsService.testJira(this.jiraForm.getRawValue()).subscribe({
      next: () => this.jiraTestMessage.set('اتصال Jira موفق بود.'),
      error: (error) => this.jiraTestMessage.set(error.message),
    });
  }

  saveJiraConnection(): void {
    if (this.jiraForm.invalid) {
      this.jiraForm.markAllAsTouched();
      return;
    }

    this.integrationSettingsService.configureJira(this.jiraForm.getRawValue()).subscribe({
      next: () => {
        this.jiraTestMessage.set('اتصال Jira ذخیره شد.');
        this.loadIntegrationStatus();
      },
      error: (error) => this.jiraTestMessage.set(error.message),
    });
  }

  testGitLabConnection(): void {
    if (this.gitlabForm.invalid) {
      this.gitlabForm.markAllAsTouched();
      return;
    }

    this.gitlabTestMessage.set('در حال تست GitLab...');

    this.integrationSettingsService.testGitLab(this.gitlabForm.getRawValue()).subscribe({
      next: () => this.gitlabTestMessage.set('اتصال GitLab موفق بود.'),
      error: (error) => this.gitlabTestMessage.set(error.message),
    });
  }

  saveGitLabConnection(): void {
    if (this.gitlabForm.invalid) {
      this.gitlabForm.markAllAsTouched();
      return;
    }

    this.integrationSettingsService.configureGitLab(this.gitlabForm.getRawValue()).subscribe({
      next: () => {
        this.gitlabTestMessage.set('اتصال GitLab ذخیره شد.');
        this.loadIntegrationStatus();
      },
      error: (error) => this.gitlabTestMessage.set(error.message),
    });
  }
}
