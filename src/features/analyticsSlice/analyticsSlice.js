import { createSlice } from '@reduxjs/toolkit';

import {
  ANALYTICS_STATE_SEED,
  STATE_STORAGE_ANALYTICS_KEY,
} from '../../configs';
import refreshStats from './utils/refreshStats';
import {
  hasPersistentState,
  loadPersistentState,
} from '../../app/persistAppsVulnsMiddleware';

export const loadState = (seed, resetCachedState = false) => {
  // Try to restore a state from a cache.
  let recoveredState = seed;
  if (!resetCachedState && hasPersistentState(STATE_STORAGE_ANALYTICS_KEY)) {
    recoveredState = loadPersistentState(STATE_STORAGE_ANALYTICS_KEY);
  }

  // Refresh analytical stats after last save.
  const {
    overallRisk,
    velocityRisk,
    quantityRisk,
    currentVulns,
    last30dVulns,
    patchVelocity,
  } = refreshStats(recoveredState);
  return {
    ...recoveredState,
    overallRisk,
    velocityRisk,
    quantityRisk,
    currentVulns,
    last30dVulns,
    patchVelocity,
  };
};

const analyticsSlice = createSlice({
  name: 'appsVulns',
  initialState: loadState(ANALYTICS_STATE_SEED),
  reducers: {
    /**
     * Recalculate analytics for a new list of local affected apps.
     */
    refreshAnalytics(state, { payload }) {
      state.overallRisk = payload.overallRisk;
      state.velocityRisk = payload.velocityRisk;
      state.quantityRisk = payload.quantityRisk;
      state.currentVulns = payload.currentVulns;
      state.last30dVulns = payload.last30dVulns;
      state.patchVelocity = payload.patchVelocity;
      state.benchmarkVelocity = payload.benchmarkVelocity;
      state.otherUsersVelocity = payload.otherUsersVelocity;
      state.updateHistory = payload.updateHistory;
      state.localAffectedAppsForAnalytics = payload.localAffectedAppsForAnalytics;
    },
  },
});

export const { refreshAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
