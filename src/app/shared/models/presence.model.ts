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
  floor: number;
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
