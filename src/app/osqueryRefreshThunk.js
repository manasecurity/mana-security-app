import { ipcRenderer } from 'electron';
import { createHash } from 'crypto';

import { OSQUERY_REFRESH_TIMEOUT } from '../configs';

import { setRepoAndAppsVulns } from '../features/appsVulnerabilities/appsVulnsSlice';
import detectAffectedApps from '../features/appsVulnerabilities/detectAffectedApps';
import recalculateAnalytics from '../features/analyticsSlice/utils/recalculateAnalytics';
import { refreshAnalytics } from '../features/analyticsSlice/analyticsSlice';

const localAppsChanged = (oldState, newState) => {
  if (!oldState) return false;

  return (
    oldState.localAppsHash !== newState.localAppsHash ||
    oldState.localVulnerableAppsHash !== newState.localVulnerableAppsHash
  );
};

export default function osqueryRefreshThunk() {
  return (dispatch, getState) => {
    console.debug('starting osquery sync...');

    ipcRenderer
      .invoke('osquery:fetch-apps')
      .then((result) => {
        const { osqueryResponse, error } = result;
        if (!error) {
          const { appsVulns, analytics } = getState();
          const affectedApps = detectAffectedApps({
            ...appsVulns,
            localApps: osqueryResponse,
          });

          const shaLocalApps = createHash('sha1')
            .update(JSON.stringify(osqueryResponse))
            .digest('hex');
          const shaAffectedApps = createHash('sha1')
            .update(JSON.stringify(affectedApps))
            .digest('hex');

          const newAppsVulns = {
            ...appsVulns,
            localApps: osqueryResponse,
            localVulnerableApps: affectedApps,
            localAppsHash: shaLocalApps,
            localVulnerableAppsHash: shaAffectedApps,
          };

          if (localAppsChanged(appsVulns, newAppsVulns)) {
            ipcRenderer.send('persist:update-apps-vulns', newAppsVulns);
          }

          const newAnalytics = recalculateAnalytics(analytics, newAppsVulns);
          dispatch(setRepoAndAppsVulns(newAppsVulns));
          dispatch(refreshAnalytics(newAnalytics));
        } else {
          console.error('osquery ipc failed');
        }
        return true;
      })
      .catch((error) => {
        console.error('ipcRenderer exception: %O', error);
      });

    return setTimeout(() => {
      dispatch(osqueryRefreshThunk());
    }, OSQUERY_REFRESH_TIMEOUT);
  };
}
