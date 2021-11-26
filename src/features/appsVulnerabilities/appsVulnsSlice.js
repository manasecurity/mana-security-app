import { createSlice } from '@reduxjs/toolkit';

import {
  hasPersistentState,
  loadPersistentState,
} from '../../app/persistAppsVulnsMiddleware';
import { STATE_STORAGE_APPSVULNS_KEY } from '../../configs';
import { resetKey, setKey } from '../subscriptionSlice/subscriptionSlice';

export const makeStateSeed = () => {
  return {
    appsRepo: {},
    vulnsRepo: {},
    repoColdSyncTime: 0, // UTC Unix time
    repoColdHash: '', // Used both for backend sync and local storage.
    repoHotHash: '', // Used both for backend sync and local storage.

    localApps: [],
    localVulnerableApps: [],
    localAppsHash: '', // Used for local storage.
    localVulnerableAppsHash: '', // Used for local storage.
  };
};

/**
 * Load initial state for local apps' vulns. Prefers a load from the cache. If the cache is missing,
 * loads state from the given seed state.
 *
 * @param {Dict} seed empty state for apps' vulns.
 * @param {bool} resetCachedState a flag to reset a cached state.
 * @returns a state for local apps' vulns.
 */
const initState = (seed, resetCachedState = false) => {
  // Try to restore a state from a cache.
  let recoveredState = seed;
  if (!resetCachedState && hasPersistentState(STATE_STORAGE_APPSVULNS_KEY)) {
    recoveredState = {
      ...recoveredState,
      ...loadPersistentState(STATE_STORAGE_APPSVULNS_KEY),
    };
  }

  return recoveredState;
};

const appsVulnsSlice = createSlice({
  name: 'appsVulns',
  initialState: initState(makeStateSeed()),
  reducers: {
    setRepoAndAppsVulns(state, { payload }) {
      state.vulnsRepo = payload.vulnsRepo;
      state.appsRepo = payload.appsRepo;
      state.repoColdHash = payload.repoColdHash;
      state.repoHotHash = payload.repoHotHash;
      state.repoColdSyncTime = payload.repoColdSyncTime;

      state.localApps = payload.localApps;
      state.localVulnerableApps = payload.localVulnerableApps;
      state.localAppsHash = payload.localAppsHash;
      state.localVulnerableAppsHash = payload.localVulnerableAppsHash;
    },

    resetRepos(state, action) {
      console.log('reset repo hashes and sync time');
      state.repoColdHash = '';
      state.repoHotHash = '';
      state.repoColdSyncTime = 0;
    },
  },
  extraReducers: (builder) => {
    // When an access key changes, our repo of remote apps/vulns changes. If on the next sync round
    // we will download an incremental repo update, UI logic may not find necessary resources and
    // app will crash softly. So in order to properly resetup it, we should clear repos' hashes.
    builder.addCase(resetKey, (state, action) => {
      appsVulnsSlice.caseReducers.resetRepos(state, action);
    });
    builder.addCase(setKey, (state, action) => {
      appsVulnsSlice.caseReducers.resetRepos(state, action);
    });
  },
});

export const { setRepoAndAppsVulns } = appsVulnsSlice.actions;
export default appsVulnsSlice.reducer;
