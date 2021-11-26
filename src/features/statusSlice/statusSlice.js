import { createSlice } from '@reduxjs/toolkit';

import { STATUS_STATE_SEED, STATE_STORAGE_STATUS_KEY } from '../../configs';
import {
  hasPersistentState,
  loadPersistentState,
} from '../../app/persistAppsVulnsMiddleware';

export const loadState = (seed, resetCachedState = false) => {
  // Try to restore a state from a cache.
  let recoveredState = seed;
  if (!resetCachedState && hasPersistentState(STATE_STORAGE_STATUS_KEY)) {
    recoveredState = loadPersistentState(STATE_STORAGE_STATUS_KEY);
  }

  // Refresh analytical stats after last save.
  const { firstLaunch } = recoveredState;
  return {
    ...seed,
    firstLaunch,
  };
};

const statusSlice = createSlice({
  name: 'appsVulns',
  initialState: loadState(STATUS_STATE_SEED),
  reducers: {
    setSyncStatus(state, { payload }) {
      const { inSync } = payload;

      const onboardingCompleted = state.syncInProgress && !inSync;
      if (onboardingCompleted) {
        state.firstLaunch = false;
      }

      state.syncInProgress = inSync;
    },

    setOnline(state, { isOnline }) {
      state.online = isOnline;
    },
  },
});

export const { setSyncStatus, setOnline } = statusSlice.actions;
export default statusSlice.reducer;
