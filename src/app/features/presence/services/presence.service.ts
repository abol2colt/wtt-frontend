import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  ActivePresenceResponse,
  ClockInPayload,
  ClockOutPayload,
  MissionCreatePayload,
  MissionRequest,
  PaginatedResponse,
  PresenceCountResponse,
  ProjectDetailsResponse,
  RequestRange,
  RequestsCountResponse,
  VacationCreatePayload,
  VacationRequest,
  VacationType,
} from '../../../shared/models/presence.model';

interface WttProjectsResponse {
  my_projects?: { id: number; title: string; description?: string }[];
  all_projects?: { id: number; title: string; description?: string }[];
  all_active_projects?: { id: number; title: string; description?: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPresenceCount(userId: number) {
    const params = new HttpParams().set('user', userId);

    return this.http.get<PresenceCountResponse>(`${this.apiBaseUrl}/presence/presence_count/`, {
      params,
    });
  }

  getProjects() {
    return this.http
      .get<WttProjectsResponse>(`${this.apiBaseUrl}/project/get_all_projects/`)
      .pipe(
        map((response) =>
          response.all_active_projects?.length
            ? response.all_active_projects
            : (response.all_projects ?? response.my_projects ?? []),
        ),
      );
  }

  getActivePresence() {
    const params = new HttpParams().set('range', 'today');

    return this.http.get<ActivePresenceResponse>(
      `${this.apiBaseUrl}/presence/no_end_time_presence/`,
      { params },
    );
  }

  clockIn(payload: ClockInPayload) {
    if (!environment.enableRealPresenceMutation) {
      return throwError(
        () => new Error('Real presence mutation is disabled by environment safety flag.'),
      );
    }

    return this.http.post<ActivePresenceResponse>(`${this.apiBaseUrl}/presence/`, payload);
  }

  clockOut(presenceId: number, payload: ClockOutPayload) {
    if (!environment.enableRealPresenceMutation) {
      return throwError(
        () => new Error('Real presence mutation is disabled by environment safety flag.'),
      );
    }

    return this.http.put<ActivePresenceResponse>(
      `${this.apiBaseUrl}/presence/${presenceId}/`,
      payload,
    );
  }

  getMissionsCount(range: RequestRange) {
    const params = new HttpParams().set('range', range);

    return this.http.get<RequestsCountResponse>(`${this.apiBaseUrl}/mission/missions_count/`, {
      params,
    });
  }

  getMissions(range: RequestRange, page = 1) {
    const params = new HttpParams().set('range', range).set('page', page);

    return this.http.get<PaginatedResponse<MissionRequest>>(`${this.apiBaseUrl}/mission/`, {
      params,
    });
  }

  createMission(payload: MissionCreatePayload) {
    return this.http.post<MissionRequest>(`${this.apiBaseUrl}/mission/`, payload);
  }

  deleteMission(id: number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/mission/${id}/`);
  }

  getVacationsCount(range: RequestRange) {
    const params = new HttpParams().set('range', range);

    return this.http.get<RequestsCountResponse>(`${this.apiBaseUrl}/vacation/vacations_count/`, {
      params,
    });
  }

  getVacations(range: RequestRange, page = 1) {
    const params = new HttpParams().set('range', range).set('page', page);

    return this.http.get<PaginatedResponse<VacationRequest>>(`${this.apiBaseUrl}/vacation/`, {
      params,
    });
  }

  createVacation(payload: VacationCreatePayload) {
    return this.http.post<VacationRequest>(`${this.apiBaseUrl}/vacation/`, payload);
  }

  getVacationTypes() {
    return this.http.get<VacationType[]>(`${this.apiBaseUrl}/vacation/types/`);
  }

  getProjectDetails(projectId: number) {
    const params = new HttpParams().set('id', projectId);

    return this.http.get<ProjectDetailsResponse>(`${this.apiBaseUrl}/project/project_details/`, {
      params,
    });
  }
}
