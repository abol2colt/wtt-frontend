export const environment = {
  production: true,

  // In deployed environments these paths should be handled by the reverse proxy/API gateway.
  apiBaseUrl: '/wtt-api/api/v1',
  integrationProxyBaseUrl: '/api',

  // Real mutations stay disabled by default for internship/demo safety.
  enableRealTaskMutation: false,
  taskMutationTestPrefix: '[FRONTEND-TEST-DO-NOT-APPROVE]',
  enableRealPresenceMutation: false,
  enableIntegrationMockMode: false,

  // Legacy flags stay temporarily until each feature service is migrated to real APIs.
  contractBaseUrl: '',
  temporaryUserId: 273,
  useMockData: false,
  useContractApi: false,
};
