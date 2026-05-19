import { Injectable, effect, signal } from '@angular/core';

export type AiTone = 'formal' | 'technical' | 'managerial';
export type AiDetailLevel = 'short' | 'balanced' | 'detailed';
export type UiAccent = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber';
export type AnimationLevel = 'off' | 'subtle' | 'vivid';
export type DashboardDensity = 'comfortable' | 'compact';
export type ReportLanguage = 'fa' | 'en' | 'bilingual';

export interface UserPreferences {
  aiTone: AiTone;
  aiDetailLevel: AiDetailLevel;
  uiAccent: UiAccent;
  animationLevel: AnimationLevel;
  dashboardDensity: DashboardDensity;
  reportLanguage: ReportLanguage;
}

const STORAGE_KEY = 'wtt:user-preferences';

const AI_TONES: readonly AiTone[] = ['formal', 'technical', 'managerial'];
const AI_DETAIL_LEVELS: readonly AiDetailLevel[] = ['short', 'balanced', 'detailed'];
const UI_ACCENTS: readonly UiAccent[] = ['violet', 'cyan', 'emerald', 'rose', 'amber'];
const ANIMATION_LEVELS: readonly AnimationLevel[] = ['off', 'subtle', 'vivid'];
const DASHBOARD_DENSITIES: readonly DashboardDensity[] = ['comfortable', 'compact'];
const REPORT_LANGUAGES: readonly ReportLanguage[] = ['fa', 'en', 'bilingual'];

const DEFAULT_PREFERENCES: UserPreferences = {
  aiTone: 'formal',
  aiDetailLevel: 'balanced',
  uiAccent: 'violet',
  animationLevel: 'subtle',
  dashboardDensity: 'comfortable',
  reportLanguage: 'fa',
};

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  readonly preferences = signal<UserPreferences>(this.loadPreferences());

  constructor() {
    effect(() => {
      this.persistPreferences(this.preferences());
    });
  }

  setAiTone(value: AiTone): void {
    this.setPreference('aiTone', value);
  }

  setAiDetailLevel(value: AiDetailLevel): void {
    this.setPreference('aiDetailLevel', value);
  }

  setUiAccent(value: UiAccent): void {
    this.setPreference('uiAccent', value);
  }

  setAnimationLevel(value: AnimationLevel): void {
    this.setPreference('animationLevel', value);
  }

  setDashboardDensity(value: DashboardDensity): void {
    this.setPreference('dashboardDensity', value);
  }

  setReportLanguage(value: ReportLanguage): void {
    this.setPreference('reportLanguage', value);
  }

  private setPreference<Key extends keyof UserPreferences>(
    key: Key,
    value: UserPreferences[Key],
  ): void {
    this.preferences.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  private loadPreferences(): UserPreferences {
    if (!this.canUseLocalStorage()) {
      return { ...DEFAULT_PREFERENCES };
    }

    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return { ...DEFAULT_PREFERENCES };
      }

      const parsedValue = JSON.parse(storedValue) as Partial<UserPreferences>;

      return {
        aiTone: this.pickAllowed(parsedValue.aiTone, AI_TONES, DEFAULT_PREFERENCES.aiTone),
        aiDetailLevel: this.pickAllowed(
          parsedValue.aiDetailLevel,
          AI_DETAIL_LEVELS,
          DEFAULT_PREFERENCES.aiDetailLevel,
        ),
        uiAccent: this.pickAllowed(parsedValue.uiAccent, UI_ACCENTS, DEFAULT_PREFERENCES.uiAccent),
        animationLevel: this.pickAllowed(
          parsedValue.animationLevel,
          ANIMATION_LEVELS,
          DEFAULT_PREFERENCES.animationLevel,
        ),
        dashboardDensity: this.pickAllowed(
          parsedValue.dashboardDensity,
          DASHBOARD_DENSITIES,
          DEFAULT_PREFERENCES.dashboardDensity,
        ),
        reportLanguage: this.pickAllowed(
          parsedValue.reportLanguage,
          REPORT_LANGUAGES,
          DEFAULT_PREFERENCES.reportLanguage,
        ),
      };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private persistPreferences(preferences: UserPreferences): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Preferences are non-critical; private browsing or quota errors should not break Settings.
    }
  }

  private pickAllowed<Value extends string>(
    value: unknown,
    allowedValues: readonly Value[],
    fallback: Value,
  ): Value {
    return typeof value === 'string' && allowedValues.includes(value as Value)
      ? (value as Value)
      : fallback;
  }

  private canUseLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
