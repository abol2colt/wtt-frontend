export interface ProjectDetailsPreselect {
  serviceId: number;
  contractId: number;
}

export type TaskViewMode = 'list' | 'grid';
export type TaskStatusFilter = 'all' | 'pending' | 'rejected';
export type WorklogFlowType = 'manual' | 'ai';
export type AiTone = 'formal' | 'technical' | 'managerial';
export type AiDetailLevel = 'short' | 'balanced' | 'detailed';
