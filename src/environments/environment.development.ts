export const environment = {
  production: false,

  // Local dev uses Angular proxy to call the real WTT v1 API without browser CORS issues.
  apiBaseUrl: '/wtt-api/api/v1',

  // Legacy flags stay temporarily until each feature service is migrated to real APIs.
  contractBaseUrl: '',
  temporaryUserId: 273,
  useMockData: false,
  useContractApi: false,
};
