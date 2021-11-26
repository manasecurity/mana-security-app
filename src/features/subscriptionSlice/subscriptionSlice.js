import { createSlice } from '@reduxjs/toolkit';

import {
  STATE_STORAGE_SUBSCRIPTION_KEY,
  SUBSCRIPTION_STATE_SEED,
} from '../../configs';
import {
  hasPersistentState,
  loadPersistentState,
} from '../../app/persistAppsVulnsMiddleware';

export const loadState = (seed, resetCachedState = false) => {
  // Try to restore a state from a cache.
  let recoveredState = seed;
  if (!resetCachedState && hasPersistentState(STATE_STORAGE_SUBSCRIPTION_KEY)) {
    recoveredState = loadPersistentState(STATE_STORAGE_SUBSCRIPTION_KEY);
  }

  return {
    ...seed,
    ...recoveredState,
  };
};

const subscriptionSlice = createSlice({
  name: 'appsVulns',
  initialState: loadState(SUBSCRIPTION_STATE_SEED),
  reducers: {
    setSubscription(state, { payload }) {
      return true;
    },

    setKey(state, { payload }) {
      state.key = payload.key;
      state.paid = true;
    },

    resetKey(state) {
      state.key = '';
      state.paid = false;
    },
  },
});

export const { setSubscription, setKey, resetKey } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
