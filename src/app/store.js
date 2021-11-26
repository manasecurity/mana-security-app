import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { vulnApi } from '../features/appsVulnerabilities/service/vulnApi';
import appsVulnsReducer from '../features/appsVulnerabilities/appsVulnsSlice';
import analyticsSlice from '../features/analyticsSlice/analyticsSlice';
import statusSlice from '../features/statusSlice/statusSlice';
import { persistAppsVulnsMiddleware } from './persistAppsVulnsMiddleware';
import subscriptionSlice from '../features/subscriptionSlice/subscriptionSlice';

const loggerMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  console.log('next state', storeAPI.getState());
  return result;
};

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: combineReducers({
    [vulnApi.reducerPath]: vulnApi.reducer,
    appsVulns: appsVulnsReducer,
    analytics: analyticsSlice,
    status: statusSlice,
    subscription: subscriptionSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      vulnApi.middleware,
      // loggerMiddleware,
      persistAppsVulnsMiddleware,
    ]),
});

setupListeners(store.dispatch);
