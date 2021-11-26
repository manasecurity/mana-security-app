import Store from 'electron-store';
import {
  STATE_STORAGE_ANALYTICS_KEY,
  STATE_STORAGE_APPSVULNS_KEY,
  STATE_STORAGE_STATUS_KEY,
} from '../../configs';

const persistenStore = new Store({
  name: 'manaconfig',
  fileExtension: 'json',
});

/**
 * Saves a state of apps' vulns on disk.
 *
 * @param {Dict} value apps' state part.
 */
export const savePersistentState = (key, value) => {
  persistenStore.set(key, value);
};

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
