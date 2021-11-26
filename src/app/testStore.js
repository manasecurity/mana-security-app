import { combineReducers, createSlice, createStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { makeStateSeed } from '../features/appsVulnerabilities/appsVulnsSlice';
import { vulnApi } from '../features/appsVulnerabilities/service/vulnApi';

const dumbAppReducer = createSlice({
  name: 'appsVulns',
  initialState: makeStateSeed(),
});

// eslint-disable-next-line import/prefer-default-export
export const store = createStore(
  combineReducers({
    [vulnApi.reducerPath]: vulnApi.reducer,
    appsVulns: dumbAppReducer,
  })
);

setupListeners(store.dispatch);
