import { ipcRenderer } from 'electron';
import produce from 'immer';

import difference from '../../../utils/set/difference';
import intersection from '../../../utils/set/intersection';
import nowUnixTime from '../../appsVulnerabilities/nowUnixTime';
import refreshStats from './refreshStats';

export default function recalculateAnalytics(oldState, payload) {
  const newState = produce(oldState, (draft) => {
    // Timestamp for new vulns or fixed vulns.
    const nowUtc = nowUnixTime();

    const { localVulnerableApps } = payload;
    const oldAffectedAppsSet = Object.keys(
      oldState.localAffectedAppsForAnalytics
    ).reduce((set, x) => set.add(x), new Set());
    const newAffectedAppsSet = Object.keys(localVulnerableApps).reduce(
      (set, x) => set.add(x),
      new Set()
    );

    // Move patched apps to history.
    const patchedApps = difference(oldAffectedAppsSet, newAffectedAppsSet);
    const patchedAnalytApps = patchedApps.values().reduce((buff, x) => {
      try {
        const tmp = {
          ...oldState.localAffectedAppsForAnalytics[x],
          patched: nowUtc,
        };
        buff.unshift(tmp);
        return buff;
      } catch(e) {
        console.error("Could not find patched app '%O'. Error: %O", x, e);
        return buff;
      }
      // tmp.patched = nowUtc;
      // tmp.patchedVersion = payload.appsRepo[x].current_version;
    }, []);
    if (patchedAnalytApps.length > 0) {
      draft.updateHistory = oldState.updateHistory.concat(patchedAnalytApps);
      patchedAnalytApps.forEach((entry) => {
        const { cpe, appName } = entry;
        ipcRenderer.send('vulns-notification', {
          title: `${appName} has been successfully patched`,
          body: 'Good job!',
        });
      });
    }

    // Keep existing flawed apps.
    const existingAffectedApps = intersection(
      oldAffectedAppsSet,
      newAffectedAppsSet
    );
    const existingAnalytApps = existingAffectedApps
      .values()
      .reduce((buff, x) => {
        buff[x] = oldState.localAffectedAppsForAnalytics[x];
        return buff;
      }, {});

    // Add new affected apps to state.
    const newUniqueAffectedApps = difference(
      newAffectedAppsSet,
      oldAffectedAppsSet
    );
    const newAnalytApps = newUniqueAffectedApps.values().reduce((buff, x) => {
      buff[x] = {
        appName: payload.appsRepo[x].app_name,
        appeared: nowUtc,
        version: localVulnerableApps[x].currentVersion,
        patchedVersion: payload.appsRepo[x].current_version,
        cpe: x,
      };
      const appName = payload.appsRepo[x].app_name;
      ipcRenderer.send('vulns-notification', {
        title: `${appName} has a new vulnerability`,
        body: `Update it to the latest version`,
      });
      return buff;
    }, {});

    // Compose new affected apps set from intersection and newly added flawed apps.
    draft.localAffectedAppsForAnalytics = {
      ...existingAnalytApps,
      ...newAnalytApps,
    };

    // Recalculate velocity.
    const stats = refreshStats(draft);
    const {
      overallRisk,
      velocityRisk,
      quantityRisk,
      currentVulns,
      last30dVulns,
      patchVelocity,
    } = stats;
    draft.overallRisk = overallRisk;
    draft.velocityRisk = velocityRisk;
    draft.quantityRisk = quantityRisk;
    draft.currentVulns = currentVulns;
    draft.last30dVulns = last30dVulns;
    draft.patchVelocity = patchVelocity;
  });

  ipcRenderer.send('persist:update-analytics', newState);
  return newState;
}
