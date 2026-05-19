import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
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
  templateUrl: './settings.html',
})
export class SettingsComponent {
  readonly preferencesService = inject(UserPreferencesService);
  readonly activeTab = signal<SettingsTab>('profile');

  readonly enableRealTaskMutation = environment.enableRealTaskMutation;
  readonly enableRealPresenceMutation = environment.enableRealPresenceMutation;
  readonly jiraBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly gitlabBaseUrlLabel = 'در سمت backend/proxy نگهداری می‌شود';
  readonly disabledConnectionTooltip =
    'در دمو امن، تست اتصال غیرفعال است و هیچ توکن یا درخواست واقعی از مرورگر ارسال نمی‌شود.';

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
}
