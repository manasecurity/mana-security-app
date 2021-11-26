import convertToCPEName from './convertToCPEName';
import filterAffectedHostApps from './filterAffectedHostApps';
import filterByNotMatchingName from '../../utils/osquery/filterByNotMatchingName';
import makeAppRepoNamesSet from './makeAppRepoNamesSet';
import mixinVulns from './mixinVulns';

/**
 * Makes a list with local apps affected by vulns.
 *
 * @param {List} hostAppsList local apps' list.
 * @param {Dict} appsRepo supported apps as <CPE>:<App>.
 * @param {Dict} vulnsRepo supported vulns as <CVE>:<Vuln>.
 * @returns a dict <CPE>:<App> with affected local apps and relevant vulns.
 */

export default function getAffectedHostApps(hostAppsList, appsRepo, vulnsRepo) {
  // Filter apps from osquery list which Mana doesn't support.
  const appRepoNamesSet = makeAppRepoNamesSet(appsRepo);
  const hostAppsTruncated = filterByNotMatchingName(
    hostAppsList,
    appRepoNamesSet
  );

  // Normalise host apps names to a map with <CPE name>:<Osquery App> pairs.
  const normalisedAppNames = new Map(
    hostAppsTruncated.map((i) => [convertToCPEName(i, appsRepo), i])
  );

  // Match apps wth vulns.
  const hostAppsWithVulns = mixinVulns(normalisedAppNames, vulnsRepo, appsRepo);
  const affectedHostApps = filterAffectedHostApps(hostAppsWithVulns);

  return affectedHostApps;
}
