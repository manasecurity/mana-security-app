import axios from 'axios';
import produce from 'immer';
import { createHash } from 'crypto';
import { ipcRenderer } from 'electron';

import { setRepoAndAppsVulns } from '../features/appsVulnerabilities/appsVulnsSlice';
import coldRepoExpired from '../features/appsVulnerabilities/coldRepoExpired';
import detectAffectedApps from '../features/appsVulnerabilities/detectAffectedApps';
import nowUnixTime from '../features/appsVulnerabilities/nowUnixTime';
import { setSyncStatus } from '../features/statusSlice/statusSlice';
import filterRelevantCVENames from '../utils/nvd/filterRelevantCVENames';
import getCPEName from '../utils/nvd/getCPEName';
import recalculateAnalytics from '../features/analyticsSlice/utils/recalculateAnalytics';
import { refreshAnalytics } from '../features/analyticsSlice/analyticsSlice';
import { resetKey } from '../features/subscriptionSlice/subscriptionSlice';

const META_REFETCH_TIMEOUT = 1 * 60 * 1000; // refetch meta files every minute.

const manaAxios = axios.create({
  baseURL: 'https://slack.manasecurity.com/api/v1.0/',
  timeout: 30000,
});

const normaliseMeta = (results) => {
  // Normalise meta data of the remote repository.
  const meta = results.data.results;
  const metaDict = meta.reduce((buff, metaEntity) => {
    buff[metaEntity.name] = metaEntity;
    return buff;
  }, {});

  return metaDict;
};

const handleRepoResponse = (results) => {
  const repo = results.data;

  // Transform apps into a dict by CPE name.
  const appsById = repo.apps.reduce((buff, app) => {
    // Detect a CPE name.
    const cpeName = getCPEName(app);

    // Initial apps' dict does not contain a mapping to vulns. To improve the performance
    // of vulnerability lookup, we have to add all relevant CVE ids into the app.
    const vulns = filterRelevantCVENames(cpeName, repo.vulns);

    // Now everything is ready, so we transform initial app object into a map: <CPE>:<App>.
    buff[cpeName] = {
      ...app,
      vulns,
    };
    return buff;
  }, {});

  // Transform vulns into a dict by CVE id.
  console.info(`Received ${repo.vulns.length} vulns`);
  const vulnsById = repo.vulns.reduce((buff, vuln) => {
    buff[vuln.cve] = vuln;
    return buff;
  }, {});

  return [
    {
      apps: appsById,
      vulns: vulnsById,
      name: repo.name,
    },
    false,
  ];
};

const fetchRepo = (path, accessKey) => {
  return manaAxios
    .get(path, { headers: { Authorization: `Token ${accessKey}` } })
    .then((results) => handleRepoResponse(results))
    .catch((error) => {
      console.error(`repo fetch failure: ${error}`);
      return [{}, error];
    });
};

const restartThunkWithTimeout = (dispatch, thunkFn) => {
  setTimeout(() => {
    console.debug('restarting repo sync');
    dispatch(thunkFn());
  }, META_REFETCH_TIMEOUT);
  return 'ok';
};

/**
 * Identitifies local vulns for a given repo and local apps. After it – sets the new state for
 * appsVulnsSlice.
 *
 * @param {*} appsVulnsState current state with repo and local apps/vulns.
 * @param {fn} dispatch store's dispatch fn.
 */
const syncLocalVulns = (appsVulnsState, analyticsState, dispatch) => {
  const affectedApps = detectAffectedApps(appsVulnsState);

  const shaAffectedApps = createHash('sha1')
    .update(JSON.stringify(affectedApps))
    .digest('hex');

  const newAppsVulnsState = {
    ...appsVulnsState,
    localVulnerableApps: affectedApps,
  };

  if (appsVulnsState.localVulnerableAppsHash !== shaAffectedApps) {
    ipcRenderer.send('persist:update-apps-vulns', newAppsVulnsState);
  }

  // Refresh apps' vuln state.
  const newAnalytics = recalculateAnalytics(analyticsState, newAppsVulnsState);
  dispatch(setRepoAndAppsVulns(newAppsVulnsState));
  dispatch(refreshAnalytics(newAnalytics));
};

const syncPaidStatus = (repoName, isPaid, dispatch) => {
  if (repoName.startsWith('free') && isPaid) dispatch(resetKey());
};

const syncMissingRepo = async (
  dispatch,
  accessKey,
  isPaid,
  appsVulnsState,
  analyticsState,
  localMeta,
  remoteMeta
) => {
  console.debug(
    '[repo sync] cold expired: %s; cold sha differ: %s; hot sha differ: %s',
    coldRepoExpired(localMeta.repoColdSyncTime),
    localMeta.repoColdHash !== remoteMeta.all_vulns.sha256,
    localMeta.repoHotHash !== remoteMeta.new_vulns.sha256
  );

  // Compare local and remote hashes for cold and hot repos. If any differs, download the
  // corresponding repo.
  let fetchError = false;
  let repo = {};
  if (
    coldRepoExpired(localMeta.repoColdSyncTime) &&
    localMeta.repoColdHash !== remoteMeta.all_vulns.sha256
  ) {
    // Download cold cache.
    const newSyncTime = nowUnixTime();
    [repo, fetchError] = await fetchRepo(
      `assets/vuln_bckps/all_vulns/`,
      accessKey
    );
    if (!fetchError) {
      // We should rewrite old repo with remote version: apps/vulns that exist only in the local repo
      // should remain. If apps/vulns exist in both repos, we should rewrite with the remote
      // versions.
      //
      // For cold cache, we should refresh the corresponding sha-values for hot and cold cache.
      // It's reasonable due to cold cache includes hot cache. Otherwise the client will make
      // an excessive network request to the hot cache.
      const newAppsVulnsState = produce(appsVulnsState, (draft) => {
        draft.vulnsRepo = repo.vulns;
        draft.appsRepo = repo.apps;
        draft.repoColdHash = remoteMeta.all_vulns.sha256;
        draft.repoHotHash = remoteMeta.new_vulns.sha256;
        draft.repoColdSyncTime = newSyncTime;
      });

      syncLocalVulns(newAppsVulnsState, analyticsState, dispatch);
      syncPaidStatus(repo.name, isPaid, dispatch);
    }
  } else if (localMeta.repoHotHash !== remoteMeta.new_vulns.sha256) {
    // Download hot cache.
    [repo, fetchError] = await fetchRepo(
      `assets/vuln_bckps/new_vulns/`,
      accessKey
    );
    if (!fetchError) {
      // We should merge old repo with remote version: apps/vulns that exist only in the local repo
      // should remain. If apps/vulns exist in both repos, we should pick remote versions.
      //
      // For hot cache, we should only refresh the corresponding sha-value.
      const newAppsVulnsState = produce(appsVulnsState, (draft) => {
        draft.vulnsRepo = {
          ...draft.vulnsRepo,
          ...repo.vulns,
        };
        draft.appsRepo = {
          ...draft.appsRepo,
          ...repo.apps,
        };
        draft.repoHotHash = remoteMeta.new_vulns.sha256;
      });

      syncLocalVulns(newAppsVulnsState, analyticsState, dispatch);
      syncPaidStatus(repo.name, isPaid, dispatch);
    }
  }
};

export default function syncRepoThunk() {
  return (dispatch, getState) => {
    console.log('repo sync started');

    const { appsVulns, analytics, subscription } = getState();
    const { repoColdHash, repoHotHash, repoColdSyncTime } = appsVulns;
    const oldMeta = { repoColdHash, repoHotHash, repoColdSyncTime };

    dispatch(setSyncStatus({ inSync: true }));

    return manaAxios
      .get(`assets/vuln_bckps/`)
      .then((results) => normaliseMeta(results))
      .then((newMeta) =>
        syncMissingRepo(
          dispatch,
          subscription.key,
          subscription.paid,
          appsVulns,
          analytics,
          oldMeta,
          newMeta
        )
      )
      .then(() => dispatch(setSyncStatus({ inSync: false })))
      .then(() => restartThunkWithTimeout(dispatch, syncRepoThunk))
      .catch((error) => {
        console.log(`meta fetch failure: ${error}`);
        dispatch(setSyncStatus({ inSync: false }));
        restartThunkWithTimeout(dispatch, syncRepoThunk);
      });
  };
}
