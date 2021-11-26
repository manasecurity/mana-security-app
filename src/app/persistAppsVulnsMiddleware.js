import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import {
  STATE_STORAGE_ANALYTICS_KEY,
  STATE_STORAGE_APPSVULNS_KEY,
  STATE_STORAGE_STATUS_KEY,
} from '../configs';

const persistenStore = new Store({
  name: 'manaconfig',
  fileExtension: 'json',
});

/**
 * Checks if the state of apps' vulns is on the disk.
 *
 * @returns 'true' if state of apps' vulns is on the disk. 'false' otherwise.
 */
export const hasPersistentState = (key) => {
  return persistenStore.has(key);
};

/**
 * Loads a state of apps' vulns from the disk.
 *
 * @returns a state of apps' vulns.
 */
export const loadPersistentState = (key) => {
  const appState = persistenStore.get(key, false);
  return appState;
};

// const appsVulnsChanged = (oldState, newState) => {
//   console.log('persist: oldState hash=%s', oldState.repoColdHash);
//   if (!oldState) return false;

//   return (
//     oldState.repoColdHash !== newState.repoColdHash ||
//     oldState.repoHotHash !== newState.repoHotHash ||
//     oldState.localAppsHash !== newState.localAppsHash ||
//     oldState.localVulnerableAppsHash !== newState.localVulnerableAppsHash
//   );
// };

/**
 * Persists a part of state related to apps' vulns on disk.
 */
// eslint-disable-next-line import/prefer-default-export
export const persistAppsVulnsMiddleware = (store) => (next) => (action) => {
  const { status: statusOld } = store.getState();

  const result = next(action);

  const { status: statusNew } = store.getState();

  // if (appsVulnsChanged(appsVulnsOld, appsVulns)) {
  //   console.log('persist:update-apps-vulns');
  //   ipcRenderer.send('persist:update-apps-vulns', appsVulns);
  // }

  // savePersistentState(STATE_STORAGE_APPSVULNS_KEY, appsVulns);
  // savePersistentState(STATE_STORAGE_ANALYTICS_KEY, analytics);
  if (statusOld && statusOld.firstLaunch !== statusNew.firstLaunch) {
    ipcRenderer.send('persist:update-status', statusNew);
  }

  return result;
};
