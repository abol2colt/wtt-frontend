import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Project } from '../../../shared/models/project.model';
import {
  ActivePresenceResponse,
  MissionRequest,
  PresenceCountResponse,
  ProjectDetailsResponse,
  RequestRange,
  RequestsCountResponse,
  VacationCreatePayload,
  VacationRequest,
  VacationType,
} from '../../../shared/models/presence.model';

export type PresenceListRange = RequestRange | 'month';

export interface PresenceListUser {
  id: number;
  personnel_code?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  floor?: number;
}

export interface PresenceListItem {
  id: number;
  start_time: string;
  end_time: string | null;
  user?: PresenceListUser;
  duration: number;
  created_date?: string;
  created_by?: PresenceListUser;
  submitted_on_time: boolean;
  editable: boolean;
}

export interface PresenceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PresenceListItem[];
}

export interface PresenceMutationPayload {
  start_time: string;
  end_time?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface WttProjectsResponse {
  my_projects?: Project[];
  all_projects?: Project[];
  all_active_projects?: Project[];
}

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  getPresenceCount(
    userId?: number | null,
    range?: PresenceListRange,
  ): Observable<PresenceCountResponse> {
    let params = new HttpParams();

    params = params.set('user', String(userId ?? ''));
    if (range) {
      params = params.set('range', range);
    }

    return this.http.get<PresenceCountResponse>(`${this.apiBaseUrl}/presence/presence_count/`, {
      params,
    });
  }

  getActivePresence(): Observable<ActivePresenceResponse | null> {
    const params = new HttpParams().set('range', 'today');

    return this.http.get<ActivePresenceResponse | null>(
      `${this.apiBaseUrl}/presence/no_end_time_presence/`,
      { params },
    );
  }

  getPresences(
    range: PresenceListRange = 'month',
    page = 1,
    userId?: number | null,
  ): Observable<PresenceListResponse> {
    let params = new HttpParams().set('range', range).set('page', page);

    params = params.set('user', String(userId ?? ''));

    return this.http.get<PresenceListResponse>(`${this.apiBaseUrl}/presence/`, {
      params,
    });
  }

  clockIn(payload: PresenceMutationPayload): Observable<ActivePresenceResponse> {
    return this.http.post<ActivePresenceResponse>(`${this.apiBaseUrl}/presence/`, payload);
  }

  clockOut(
    id: number,
    payload: Required<PresenceMutationPayload>,
  ): Observable<ActivePresenceResponse> {
    return this.http.put<ActivePresenceResponse>(`${this.apiBaseUrl}/presence/${id}/`, payload);
  }

  getVacationsCount(range: RequestRange): Observable<RequestsCountResponse> {
    const params = new HttpParams().set('range', range);

    return this.http.get<RequestsCountResponse>(`${this.apiBaseUrl}/vacation/vacations_count/`, {
      params,
    });
  }

  getMissionsCount(range: RequestRange): Observable<RequestsCountResponse> {
    const params = new HttpParams().set('range', range);

    return this.http.get<RequestsCountResponse>(`${this.apiBaseUrl}/mission/missions_count/`, {
      params,
    });
  }

  getVacations(range: RequestRange, page = 1): Observable<PaginatedResponse<VacationRequest>> {
    const params = new HttpParams().set('range', range).set('page', page);

    return this.http.get<PaginatedResponse<VacationRequest>>(`${this.apiBaseUrl}/vacation/`, {
      params,
    });
  }

  getMissions(range: RequestRange, page = 1): Observable<PaginatedResponse<MissionRequest>> {
    const params = new HttpParams().set('range', range).set('page', page);

    return this.http.get<PaginatedResponse<MissionRequest>>(`${this.apiBaseUrl}/mission/`, {
      params,
    });
  }

  getVacationTypes(): Observable<VacationType[]> {
    return this.http.get<VacationType[]>(`${this.apiBaseUrl}/vacation/types/`);
  }

  createVacation(payload: VacationCreatePayload): Observable<VacationRequest> {
    return this.http.post<VacationRequest>(`${this.apiBaseUrl}/vacation/`, payload);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<WttProjectsResponse>(`${this.apiBaseUrl}/project/get_all_projects/`).pipe(
      map((response) => {
        return response.all_active_projects ?? response.all_projects ?? response.my_projects ?? [];
      }),
    );
  }

  getProjectDetails(projectId: number): Observable<ProjectDetailsResponse> {
    const params = new HttpParams().set('id', projectId);

    return this.http.get<ProjectDetailsResponse>(`${this.apiBaseUrl}/projects/project_details/`, {
      params,
    });
  }
}
