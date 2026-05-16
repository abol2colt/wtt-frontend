export const environment = {
  production: false,

  // Local dev uses Angular proxy to call the real WTT v1 API without browser CORS issues.
  apiBaseUrl: '/wtt-api/api/v1',

  // Local integration proxy for Jira-compatible tasks, GitLab evidence and AI draft generation.
  integrationProxyBaseUrl: 'http://localhost:3000/api',

  // Demo safety flags. Dangerous real mutations must stay off unless explicitly enabled locally.
  enableRealTaskMutation: false,
  enableRealPresenceMutation: false,
  enableIntegrationMockMode: true,

  // Legacy flags stay temporarily until each feature service is migrated to real APIs.
  contractBaseUrl: '',
  temporaryUserId: 273,
  useMockData: false,
  useContractApi: false,
};
