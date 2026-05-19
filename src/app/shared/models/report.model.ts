export type ReportStatus = 'approved' | 'pending' | 'rejected' | 'draft' | 'edited' | 'unknown';

export type ReportRange =
  | 'today'
  | 'week'
  | 'month'
  | 'month_till_today'
  | 'last_month'
  | 'this_year';

export type ReportsTab = 'attendance' | 'activity';

export interface ReportRow {
  id: number;
  date: string;
  title: string;
  project: string;
  durationMinutes: number;
  durationLabel: string;
  status: ReportStatus;
}

export interface ReportSummary {
  totalDurationMinutes: number;
  totalDurationLabel: string;
  totalTaskCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface ReportResponse {
  range: ReportRange;
  summary: ReportSummary;
  rows: ReportRow[];
}

export interface UserAttendanceReportResponse {
  start: string;
  end: string;
  data: UserAttendanceRow[];
  holidays: string[];
  fridays: string[];
  thursdays: string[];
  time_to_be_added: number;
}

export interface UserAttendanceRow {
  teleworking: number;
  personal: number;
  presence_summation: number;
  special_vacations_work_time: number;
  total_efficient_work: number;
  missions: number;
  accepted_missions: number;
  vacations: number;
  accepted_vacations: number;
  illness_vacations: number;
  without_pay_vacations: number;
  vacations_time: number;
  missions_time: number;
  total_work: number;
  transferred_working_time: number;
  all_task_in_days: number;
  expected_time: number;
  overtime_working: number;
  total_randeman: number;
  lunches: number;
  no_work_days: number;
  status_has_changed_in_range: boolean;
  status: string;
  first_name: string;
  last_name: string;
  available: number;
  user_id: number;
}

export interface ActivityInProjectsReportResponse {
  start: string;
  end: string;
  user: ActivityUserRow[];
}

export interface ActivityUserRow {
  first_name: string;
  last_name: string;
  username: string;
  project: ActivityProjectRow[];
}

export interface ActivityProjectRow {
  project_name: string;
  project_service: string;
  project_spent_time: number;
  percentage: string;
}
