export const ANALYTICS_STATE_SEED = {
  // Next three fields are used both in the interface and CSS classes to display stats.
  overallRisk: 'low',
  velocityRisk: 'low',
  quantityRisk: 'low',

  // Next 5 fields are used in the interface.
  currentVulns: 0,
  last30dVulns: 0,
  patchVelocity: 0, // in seconds
  benchmarkVelocity: 1 * 24 * 60 * 60, // one day in seconds
  otherUsersVelocity: 3 * 24 * 60 * 60, // 3 days in seconds

  // Last two fields are used to calculate stats above.
  updateHistory: [], // Recently patched apps appear in the beginning.
  localAffectedAppsForAnalytics: {},
};

export const STATUS_STATE_SEED = {
  syncInProgress: false,
  online: true,
  firstLaunch: true,
};

export const SUBSCRIPTION_STATE_SEED = {
  paid: false,
  key: '',
};

export const STATE_STORAGE_STATUS_KEY = 'status';
export const STATE_STORAGE_ANALYTICS_KEY = 'analytics';
export const STATE_STORAGE_APPSVULNS_KEY = 'appsVulns';
export const STATE_STORAGE_SUBSCRIPTION_KEY = 'subscription';

// How much time osquery can run. After that the process will be terminated. Timeout is set in
// milliseconds.
export const OSQUERY_RUN_TIMEOUT = 5 * 1000; // 5 seconds
export const OSQUERY_REFRESH_TIMEOUT = 60 * 1000; // each minute
