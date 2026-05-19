export interface PresenceCountResponse {
  all: number;
  no_end: number;
}

export interface PresenceUser {
  id: number;
  personnel_code: string;
  first_name: string;
  last_name: string;
  avatar: string;
  floor: number | null;
}

export interface ActivePresenceResponse {
  id: number;
  start_time: string;
  end_time: string | null;
  user?: PresenceUser;
  duration?: number;
  created_date?: string;
  created_by?: PresenceUser;
  submitted_on_time: boolean;
  editable?: boolean;
}

export interface ClockInPayload {
  start_time: string;
}

export interface ClockOutPayload {
  start_time: string;
  end_time: string;
}

export type RequestRange =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'last_month'
  | 'month_till_today'
  | 'this_year';

export type WttRequestStatus = 'accept' | 'reject' | 'pending';

export interface RequestsCountResponse {
  accept: number;
  reject: number;
  pending: number;
  all: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface VacationType {
  key: string;
  value: string;
  range: boolean;
  months?: number | null;
}

export interface VacationCreatePayload {
  start_date: string;
  description: string;
  vacation_type: string;
  end_date?: string | null;
}

export interface VacationRequest {
  id: number;
  user: PresenceUser;
  status: WttRequestStatus;
  start_date: string;
  end_date: string | null;
  description: string;
  created_date: string;
  created_by: PresenceUser;
  vacation_type: {
    key: string;
    tooltip: string;
    value: string;
  };
  verified_by: PresenceUser | null;
  verified_date: string | null;
  comment: string;
  vacation_type_comment: string;
  submitted_on_time: boolean;
  editable: boolean;
  hr_verification_status: WttRequestStatus | string;
  hr_verification_by: PresenceUser | null;
  hr_verification_date: string | null;
  range: boolean;
}

export interface MissionCreatePayload {
  title: string;
  date?: string;
  start_date: string;
  end_date?: string;
  type?: string;
  working_place?: string;
  location: string;
  description: string;
  go?: string;
  back?: string;
  project?: number;
  project_contract?: number;
  project_service?: number;
}

export interface ProjectDetailsResponse {
  services: {
    service: string;
    id: number;
  }[];
  contracts: {
    contract: string;
    id: number;
  }[];
}

export interface MissionRequest {
  id: number;
  user?: PresenceUser;
  title?: string;
  status?: WttRequestStatus | string;
  project?: {
    id: number;
    title: string;
    description?: string;
    active?: boolean;
  };
  created_date?: string;
  created_by?: PresenceUser;
  date?: string;
  grade?: string;
  type?: string;
  working_place?: string;
  location?: string;
  description?: string;
  verified_by?: PresenceUser | null;
  verified_date?: string | null;
  comment?: string;
  editable?: boolean;
  submitted_on_time?: boolean;
  go?: string;
  back?: string;
  start_date?: string;
  end_date?: string | null;
  project_contract?: {
    contract: string;
    id: number;
  };
  project_service?: {
    service: string;
    id: number;
  };

  [key: string]: unknown;
}
