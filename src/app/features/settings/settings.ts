import { Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.html',
})
export class SettingsComponent {
  reportTone = signal<'formal' | 'technical' | 'managerial'>('formal');
  detailLevel = signal<'short' | 'balanced' | 'detailed'>('balanced');

  readonly enableRealTaskMutation = environment.enableRealTaskMutation;
  readonly enableRealPresenceMutation = environment.enableRealPresenceMutation;

  setTone(value: 'formal' | 'technical' | 'managerial'): void {
    this.reportTone.set(value);
  }

  setDetailLevel(value: 'short' | 'balanced' | 'detailed'): void {
    this.detailLevel.set(value);
  }
}
