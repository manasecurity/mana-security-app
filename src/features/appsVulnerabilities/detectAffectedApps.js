import { loadApps, loadOS } from '../../utils/osquery/osqueryi';
import getAffectedHostApps from './getAffectedHostApps';
import { toOsqueryApp } from './types/osqueryApp';
import { toOsqueryOS } from './types/osqueryOS';

/**
 * Detect affected apps on a host. It makes a few things to accomplish this:
 * 1. Loads current host apps.
 * 2. Loads OS information.
 * 3. Detects vulns for given apps and OS.
 *
 * @returns JSON with initialized reducers.
 */
export default function detectAffectedApps({ appsRepo, vulnsRepo, localApps }) {
  // const osOsquery = toOsqueryOS(rawHostOS);
  // const hostAppsList = rawHostApps.map((x) => toOsqueryApp(x));
  // const hostAppsListWithOS = hostAppsList.concat(osOsquery);

  const affectedHostApps = getAffectedHostApps(localApps, appsRepo, vulnsRepo);

  // TODO: Store local apps as <CPE>:<OsqueryApp> pairs.
  return affectedHostApps;
}
