export type IntegrationProvider = 'jira' | 'gitlab' | 'ai';

export type IntegrationConnectionState =
  | 'not_configured'
  | 'connected'
  | 'failed'
  | 'testing'
  | 'syncing';

export interface IntegrationConnectionStatus {
  provider: IntegrationProvider;
  state: IntegrationConnectionState;
  connected: boolean;
  maskedAccount?: string | null;
  baseUrl?: string | null;
  lastTestedAt?: string | null;
  lastSyncedAt?: string | null;
  message?: string | null;
}

export interface JiraIntegrationConfig {
  baseUrl: string;
  email?: string;
  token: string;
  projectKey?: string;
  assignedJql?: string;
}

export interface GitLabIntegrationConfig {
  baseUrl: string;
  token: string;
  projectId?: string;
  groupId?: string;
  branchPattern?: string;
}

export interface ExternalTask {
  source: 'jira';
  id: string;
  key: string;
  title: string;
  assigneeId?: string | null;
  wttProjectId?: number | null;
  wttServiceId?: number | null;
  wttContractId?: number | null;
  branchName?: string | null;
  raw?: unknown;
}

export interface GitEvidenceCommit {
  id: string;
  shortId?: string;
  title: string;
  message?: string;
  authorName?: string;
  committedAt: string;
  webUrl?: string;
}

export interface GitEvidence {
  provider: 'gitlab';
  taskKey: string;
  branchName?: string | null;
  commits: GitEvidenceCommit[];
  firstEvidenceAt?: string | null;
  lastEvidenceAt?: string | null;
  confidenceHints?: string[];
}
