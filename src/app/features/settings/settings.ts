import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IntegrationSettingsService } from './services/integration-settings.service';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../../core/services/layout/layout.service';
import { AuthService } from '../../core/services/auth/auth.service';
import {
  AiTone,
  ReportLanguage,
  UiAccent,
  UiColorPreset,
  UiFontScale,
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
  readonly authService = inject(AuthService);

  readonly profileLoading = signal(false);
  readonly profileError = signal<string | null>(null);
  readonly profileAvatarFailed = signal(false);
  readonly activeTab = signal<SettingsTab>('profile');

  private readonly fb = inject(FormBuilder);
  private readonly integrationSettingsService = inject(IntegrationSettingsService);
  readonly enableRealTaskMutation = environment.enableRealTaskMutation;
  readonly enableRealPresenceMutation = environment.enableRealPresenceMutation;
  readonly jiraBaseUrl = 'https://support.sanayco.ir';
  readonly gitlabBaseUrl = 'https://code.sanayco.ir';
  readonly lockedBranchPattern = 'feature/{TASK_KEY}';
  readonly lockedJiraJql = 'statusCategory != Done ORDER BY updated DESC';

  readonly tokenSecurityNote =
    'توکن‌ها فقط برای ارسال به proxy استفاده می‌شوند؛ در UI نمایش داده نمی‌شوند و نباید در frontend ذخیره دائمی شوند.';
  readonly jiraBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly gitlabBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly disabledConnectionTooltip =
    'در دمو امن، تست اتصال غیرفعال است و هیچ توکن یا درخواست واقعی از مرورگر ارسال نمی‌شود.';

  readonly integrationStatus = signal<string>('در حال بررسی...');
  readonly jiraTestMessage = signal<string | null>(null);
  readonly gitlabTestMessage = signal<string | null>(null);
  readonly integrationLoading = signal(false);

  readonly jiraForm = this.fb.nonNullable.group({
    baseUrl: [this.jiraBaseUrl, [Validators.required]],
    email: ['', [Validators.required]],
    token: ['', [Validators.required]],
    authType: ['bearer'],
    apiVersion: ['2'],
    jql: [this.lockedJiraJql, [Validators.required]],
  });

  readonly gitlabForm = this.fb.nonNullable.group({
    baseUrl: [this.gitlabBaseUrl, [Validators.required]],
    token: ['', [Validators.required]],
    projectId: ['', [Validators.required]],
    branchPattern: [this.lockedBranchPattern, [Validators.required]],
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
  readonly colorOptions: { value: UiColorPreset; label: string; className: string }[] = [
    { value: 'slate', label: 'Slate', className: 'bg-slate-500' },
    { value: 'cyan', label: 'Cyan', className: 'bg-cyan-500' },
    { value: 'violet', label: 'Violet', className: 'bg-violet-500' },
    { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
    { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
    { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
  ];

  readonly fontScaleOptions: { value: UiFontScale; label: string; description: string }[] = [
    { value: 'compact', label: 'فشرده', description: '۱۵px پایه' },
    { value: 'comfortable', label: 'استاندارد', description: '۱۶px پایه' },
    { value: 'large', label: 'درشت', description: '۱۷px پایه' },
  ];
  ngOnInit(): void {
    this.syncLockedIntegrationFields();
    this.loadCurrentUserProfile();
    this.loadIntegrationStatus();
  }
  loadCurrentUserProfile(): void {
    if (!this.authService.isAuthenticated()) {
      this.profileError.set('برای نمایش پروفایل باید وارد حساب کاربری شده باشید.');
      return;
    }

    if (this.authService.currentUser()?.first_name || this.authService.currentUser()?.username) {
      return;
    }

    this.profileLoading.set(true);
    this.profileError.set(null);

    this.authService.fetchProfile().subscribe({
      next: () => {
        this.profileLoading.set(false);
        this.profileAvatarFailed.set(false);
      },
      error: () => {
        this.profileLoading.set(false);
        this.profileError.set('خطا در دریافت اطلاعات پروفایل کاربر.');
      },
    });
  }

  profileFullName(): string {
    const user = this.authService.currentUser();

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();

    return fullName || user?.username || '—';
  }

  profileInitials(): string {
    const user = this.authService.currentUser();

    const initials =
      `${user?.first_name?.charAt(0) ?? ''}${user?.last_name?.charAt(0) ?? ''}`.trim();

    return initials || user?.username?.slice(0, 2).toUpperCase() || 'WT';
  }

  profileRoleLabel(): string {
    const user = this.authService.currentUser();
    const role = user?.role || user?.workflow?.brand;

    return role || '—';
  }

  profileStatusLabel(): string {
    const status = this.authService.currentUser()?.user_status;

    if (!status) {
      return '—';
    }

    const labels: Record<string, string> = {
      full_time: 'تمام‌وقت',
      part_time: 'پاره‌وقت',
      contractor: 'پیمانکار',
    };

    return labels[status] ?? status;
  }

  profileManagerName(): string {
    const manager = this.authService.currentUser()?.workflow?.manager;

    if (!manager) {
      return '—';
    }

    return [manager.first_name, manager.last_name].filter(Boolean).join(' ').trim() || '—';
  }

  profileAvatarUrl(): string | null {
    if (this.profileAvatarFailed()) {
      return null;
    }

    const avatar = this.authService.currentUser()?.avatar?.trim();

    if (!avatar) {
      return null;
    }

    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }

    return `/wtt-api/api/v1/media_download/${avatar}/`;
  }

  onProfileAvatarError(): void {
    this.profileAvatarFailed.set(true);
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

  setReportLanguage(value: ReportLanguage): void {
    this.preferencesService.setReportLanguage(value);
  }

  setReportTone(value: AiTone): void {
    this.preferencesService.setReportTone(value);
  }

  setReportInstruction(value: string): void {
    this.preferencesService.setReportInstruction(value);
  }

  setCommitTone(value: AiTone): void {
    this.preferencesService.setCommitTone(value);
  }

  setCommitInstruction(value: string): void {
    this.preferencesService.setCommitInstruction(value);
  }

  setLightBackground(value: UiColorPreset): void {
    this.preferencesService.setLightBackground(value);
  }

  setLightCard(value: UiColorPreset): void {
    this.preferencesService.setLightCard(value);
  }

  setDarkBackground(value: UiColorPreset): void {
    this.preferencesService.setDarkBackground(value);
  }

  setDarkCard(value: UiColorPreset): void {
    this.preferencesService.setDarkCard(value);
  }

  setGlobalFontScale(value: UiFontScale): void {
    this.preferencesService.setGlobalFontScale(value);
  }

  setItemFontScale(value: UiFontScale): void {
    this.preferencesService.setItemFontScale(value);
  }

  setUiAccent(value: UiAccent): void {
    this.preferencesService.setUiAccent(value);
  }

  testJiraConnection(): void {
    this.syncLockedIntegrationFields();

    if (this.jiraForm.invalid) {
      this.jiraForm.markAllAsTouched();
      return;
    }

    this.jiraTestMessage.set('در حال تست Jira...');

    this.integrationSettingsService.testJira(this.buildJiraPayload()).subscribe({
      next: () => this.jiraTestMessage.set('اتصال Jira موفق بود.'),
      error: (error) => this.jiraTestMessage.set(error.message),
    });
  }

  private syncLockedIntegrationFields(): void {
    this.jiraForm.patchValue(
      {
        baseUrl: this.jiraBaseUrl,
        jql: this.lockedJiraJql,
      },
      { emitEvent: false },
    );

    this.gitlabForm.patchValue(
      {
        baseUrl: this.gitlabBaseUrl,
        branchPattern: this.lockedBranchPattern,
      },
      { emitEvent: false },
    );
  }

  private buildJiraPayload() {
    this.syncLockedIntegrationFields();

    return {
      ...this.jiraForm.getRawValue(),
      baseUrl: this.jiraBaseUrl,
      jql: this.lockedJiraJql,
    };
  }

  private buildGitLabPayload() {
    this.syncLockedIntegrationFields();

    return {
      ...this.gitlabForm.getRawValue(),
      baseUrl: this.gitlabBaseUrl,
      branchPattern: this.lockedBranchPattern,
    };
  }

  clearJiraToken(): void {
    this.jiraForm.controls.token.setValue('');
    this.jiraTestMessage.set('توکن Jira از فرم پاک شد.');
  }

  clearGitLabToken(): void {
    this.gitlabForm.controls.token.setValue('');
    this.gitlabTestMessage.set('توکن GitLab از فرم پاک شد.');
  }

  saveJiraConnection(): void {
    this.syncLockedIntegrationFields();

    if (this.jiraForm.invalid) {
      this.jiraForm.markAllAsTouched();
      return;
    }

    this.integrationSettingsService.configureJira(this.buildJiraPayload()).subscribe({
      next: () => {
        this.jiraTestMessage.set('اتصال Jira ذخیره شد.');
        this.loadIntegrationStatus();
      },
      error: (error) => this.jiraTestMessage.set(error.message),
    });
  }

  testGitLabConnection(): void {
    this.syncLockedIntegrationFields();

    if (this.gitlabForm.invalid) {
      this.gitlabForm.markAllAsTouched();
      return;
    }

    this.gitlabTestMessage.set('در حال تست GitLab...');

    this.integrationSettingsService.testGitLab(this.buildGitLabPayload()).subscribe({
      next: () => this.gitlabTestMessage.set('اتصال GitLab موفق بود.'),
      error: (error) => this.gitlabTestMessage.set(error.message),
    });
  }

  saveGitLabConnection(): void {
    this.syncLockedIntegrationFields();

    if (this.gitlabForm.invalid) {
      this.gitlabForm.markAllAsTouched();
      return;
    }

    this.integrationSettingsService.configureGitLab(this.buildGitLabPayload()).subscribe({
      next: () => {
        this.gitlabTestMessage.set('اتصال GitLab ذخیره شد.');
        this.loadIntegrationStatus();
      },
      error: (error) => this.gitlabTestMessage.set(error.message),
    });
  }
}
