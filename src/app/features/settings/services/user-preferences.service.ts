import { Injectable, effect, signal } from '@angular/core';

export type AiTone = 'formal' | 'technical' | 'managerial';
export type AiDetailLevel = 'short' | 'balanced' | 'detailed';
export type UiAccent = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber';
export type AnimationLevel = 'off' | 'subtle' | 'vivid';
export type DashboardDensity = 'comfortable' | 'compact';
export type ReportLanguage = 'fa' | 'en' | 'bilingual';
export type UiColorPreset = 'slate' | 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';
export type UiFontScale = 'compact' | 'comfortable' | 'large';

export interface UserPreferences {
  // Legacy fields: keep them until old UI references are fully removed.
  aiTone: AiTone;
  aiDetailLevel: AiDetailLevel;
  animationLevel: AnimationLevel;
  dashboardDensity: DashboardDensity;

  // New AI preferences.
  reportTone: AiTone;
  reportInstruction: string;
  commitTone: AiTone;
  commitInstruction: string;
  reportLanguage: ReportLanguage;

  // UI preferences.
  uiAccent: UiAccent;
  lightBackground: UiColorPreset;
  lightCard: UiColorPreset;
  darkBackground: UiColorPreset;
  darkCard: UiColorPreset;
  globalFontScale: UiFontScale;
  itemFontScale: UiFontScale;
}

const STORAGE_KEY = 'wtt:user-preferences';

const AI_TONES: readonly AiTone[] = ['formal', 'technical', 'managerial'];
const AI_DETAIL_LEVELS: readonly AiDetailLevel[] = ['short', 'balanced', 'detailed'];
const UI_ACCENTS: readonly UiAccent[] = ['violet', 'cyan', 'emerald', 'rose', 'amber'];
const ANIMATION_LEVELS: readonly AnimationLevel[] = ['off', 'subtle', 'vivid'];
const DASHBOARD_DENSITIES: readonly DashboardDensity[] = ['comfortable', 'compact'];
const REPORT_LANGUAGES: readonly ReportLanguage[] = ['fa', 'en', 'bilingual'];
const UI_COLOR_PRESETS: readonly UiColorPreset[] = [
  'slate',
  'cyan',
  'violet',
  'emerald',
  'rose',
  'amber',
];
const UI_FONT_SCALES: readonly UiFontScale[] = ['compact', 'comfortable', 'large'];

const DEFAULT_PREFERENCES: UserPreferences = {
  aiTone: 'formal',
  aiDetailLevel: 'balanced',
  animationLevel: 'subtle',
  dashboardDensity: 'comfortable',

  reportTone: 'formal',
  reportInstruction: 'گزارش را خلاصه، دقیق و قابل ارائه به مدیر بنویس.',
  commitTone: 'technical',
  commitInstruction: 'توضیح commit را بر اساس تغییرات واقعی، کوتاه و فنی بنویس.',
  reportLanguage: 'fa',

  uiAccent: 'violet',
  lightBackground: 'slate',
  lightCard: 'slate',
  darkBackground: 'slate',
  darkCard: 'slate',
  globalFontScale: 'comfortable',
  itemFontScale: 'comfortable',
};

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  readonly preferences = signal<UserPreferences>(this.loadPreferences());

  constructor() {
    effect(() => {
      const preferences = this.preferences();

      this.persistPreferences(preferences);
      this.applyVisualPreferences(preferences);
    });
  }

  // Legacy setters.
  setAiTone(value: AiTone): void {
    this.preferences.update((current) => ({
      ...current,
      aiTone: value,
      reportTone: value,
    }));
  }

  setAiDetailLevel(value: AiDetailLevel): void {
    this.setPreference('aiDetailLevel', value);
  }

  setAnimationLevel(value: AnimationLevel): void {
    this.setPreference('animationLevel', value);
  }

  setDashboardDensity(value: DashboardDensity): void {
    this.setPreference('dashboardDensity', value);
  }

  // New AI setters.
  setReportTone(value: AiTone): void {
    this.preferences.update((current) => ({
      ...current,
      reportTone: value,
      aiTone: value,
    }));
  }

  setReportInstruction(value: string): void {
    this.setPreference('reportInstruction', value);
  }

  setCommitTone(value: AiTone): void {
    this.setPreference('commitTone', value);
  }

  setCommitInstruction(value: string): void {
    this.setPreference('commitInstruction', value);
  }

  setReportLanguage(value: ReportLanguage): void {
    this.setPreference('reportLanguage', value);
  }

  // UI setters.
  setUiAccent(value: UiAccent): void {
    this.setPreference('uiAccent', value);
  }

  setLightBackground(value: UiColorPreset): void {
    this.setPreference('lightBackground', value);
  }

  setLightCard(value: UiColorPreset): void {
    this.setPreference('lightCard', value);
  }

  setDarkBackground(value: UiColorPreset): void {
    this.setPreference('darkBackground', value);
  }

  setDarkCard(value: UiColorPreset): void {
    this.setPreference('darkCard', value);
  }

  setGlobalFontScale(value: UiFontScale): void {
    this.setPreference('globalFontScale', value);
  }

  setItemFontScale(value: UiFontScale): void {
    this.setPreference('itemFontScale', value);
  }

  resolveUiColor(value: UiColorPreset, mode: 'light' | 'dark'): string {
    const lightColors: Record<UiColorPreset, string> = {
      slate: '#f8fafc',
      cyan: '#ecfeff',
      violet: '#f5f3ff',
      emerald: '#ecfdf5',
      rose: '#fff1f2',
      amber: '#fffbeb',
    };

    const darkColors: Record<UiColorPreset, string> = {
      slate: '#020617',
      cyan: '#082f49',
      violet: '#2e1065',
      emerald: '#052e16',
      rose: '#4c0519',
      amber: '#451a03',
    };

    return mode === 'light' ? lightColors[value] : darkColors[value];
  }

  resolveFontSize(value: UiFontScale): string {
    const sizes: Record<UiFontScale, string> = {
      compact: '15px',
      comfortable: '16px',
      large: '17px',
    };

    return sizes[value];
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

      const reportTone = this.pickAllowed(
        parsedValue.reportTone ?? parsedValue.aiTone,
        AI_TONES,
        DEFAULT_PREFERENCES.reportTone,
      );

      return {
        aiTone: this.pickAllowed(
          parsedValue.aiTone ?? reportTone,
          AI_TONES,
          DEFAULT_PREFERENCES.aiTone,
        ),
        aiDetailLevel: this.pickAllowed(
          parsedValue.aiDetailLevel,
          AI_DETAIL_LEVELS,
          DEFAULT_PREFERENCES.aiDetailLevel,
        ),
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

        reportTone,
        reportInstruction: this.pickText(
          parsedValue.reportInstruction,
          DEFAULT_PREFERENCES.reportInstruction,
        ),
        commitTone: this.pickAllowed(
          parsedValue.commitTone,
          AI_TONES,
          DEFAULT_PREFERENCES.commitTone,
        ),
        commitInstruction: this.pickText(
          parsedValue.commitInstruction,
          DEFAULT_PREFERENCES.commitInstruction,
        ),
        reportLanguage: this.pickAllowed(
          parsedValue.reportLanguage,
          REPORT_LANGUAGES,
          DEFAULT_PREFERENCES.reportLanguage,
        ),

        uiAccent: this.pickAllowed(parsedValue.uiAccent, UI_ACCENTS, DEFAULT_PREFERENCES.uiAccent),
        lightBackground: this.pickAllowed(
          parsedValue.lightBackground,
          UI_COLOR_PRESETS,
          DEFAULT_PREFERENCES.lightBackground,
        ),
        lightCard: this.pickAllowed(
          parsedValue.lightCard,
          UI_COLOR_PRESETS,
          DEFAULT_PREFERENCES.lightCard,
        ),
        darkBackground: this.pickAllowed(
          parsedValue.darkBackground,
          UI_COLOR_PRESETS,
          DEFAULT_PREFERENCES.darkBackground,
        ),
        darkCard: this.pickAllowed(
          parsedValue.darkCard,
          UI_COLOR_PRESETS,
          DEFAULT_PREFERENCES.darkCard,
        ),
        globalFontScale: this.pickAllowed(
          parsedValue.globalFontScale,
          UI_FONT_SCALES,
          DEFAULT_PREFERENCES.globalFontScale,
        ),
        itemFontScale: this.pickAllowed(
          parsedValue.itemFontScale,
          UI_FONT_SCALES,
          DEFAULT_PREFERENCES.itemFontScale,
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

  private applyVisualPreferences(preferences: UserPreferences): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    root.style.setProperty(
      '--wtt-ui-background-light',
      this.resolveUiColor(preferences.lightBackground, 'light'),
    );
    root.style.setProperty(
      '--wtt-ui-card-light',
      this.resolveUiColor(preferences.lightCard, 'light'),
    );
    root.style.setProperty(
      '--wtt-ui-background-dark',
      this.resolveUiColor(preferences.darkBackground, 'dark'),
    );
    root.style.setProperty('--wtt-ui-card-dark', this.resolveUiColor(preferences.darkCard, 'dark'));
    root.style.setProperty('--wtt-item-font-size', this.resolveFontSize(preferences.itemFontScale));

    root.style.fontSize = this.resolveFontSize(preferences.globalFontScale);
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

  private pickText(value: unknown, fallback: string): string {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? trimmedValue : fallback;
  }

  private canUseLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
