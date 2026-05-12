import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ActivePresenceResponse,
  ClockInPayload,
  ClockOutPayload,
  PresenceCountResponse,
} from '../../../shared/models/presence.model';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPresenceCount(userId: number) {
    const params = new HttpParams().set('user', userId);

    // Real WTT v1 endpoint for checking active/open attendance count.
    return this.http.get<PresenceCountResponse>(`${this.apiBaseUrl}/presence/presence_count/`, {
      params,
    });
  }

  getActivePresence() {
    const params = new HttpParams().set('range', 'today');

    // Real WTT v1 endpoint for the current open attendance record.
    return this.http.get<ActivePresenceResponse>(
      `${this.apiBaseUrl}/presence/no_end_time_presence/`,
      { params },
    );
  }

  clockIn(payload: ClockInPayload) {
    // Real attendance mutation. Must be guarded by UI before calling.
    return this.http.post<ActivePresenceResponse>(`${this.apiBaseUrl}/presence/`, payload);
  }

  clockOut(presenceId: number, payload: ClockOutPayload) {
    // Real attendance mutation. Must target the active presence id only.
    return this.http.put<ActivePresenceResponse>(
      `${this.apiBaseUrl}/presence/${presenceId}/`,
      payload,
    );
  }
}
