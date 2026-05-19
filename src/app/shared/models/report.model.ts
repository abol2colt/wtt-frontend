export type ReportStatus = 'approved' | 'pending' | 'rejected' | 'draft' | 'edited' | 'unknown';

export type ReportRange = 'today' | 'week' | 'month' | 'last_month';

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
