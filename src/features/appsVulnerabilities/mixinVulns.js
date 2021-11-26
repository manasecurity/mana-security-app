import produce from 'immer';
import appVersionsAffectedBy from './appVersionsAffectedBy';
import findVulnsFor, { normaliseDepth } from './findVulnsFor';
import versionBelongs from './versionBelongs';

export const UNRECOGNISED_VULN_DESCRIPTION = `
This app frequently contains security patches. It is strongly recommended to update it while
our researchers assess the security impact.
`;

const getAffectedVersionsFor = (vulnCVE, appCPE, vulnsRepo) => {
  const vulnVersion = appVersionsAffectedBy(vulnCVE, appCPE, vulnsRepo);
  const vulnVersionAndDescr = {
    ...vulnVersion,
    description: vulnsRepo[vulnCVE].description,
  };

  return [vulnCVE, vulnVersionAndDescr];
};

export function getForcedUpdateVuln(localAppCPE, localApp, remoteApp) {
  const localVer = localApp.currentVersion;
  let remoteVersions = [];
  if (remoteApp.app_versions.length) {
    const LTSCandidate = remoteApp.app_versions[0];
    const LTSRemoteVersion = LTSCandidate.current_version;

    // If current version <= LTS version.
    if (
      /\d/.test(LTSRemoteVersion) &&
      versionBelongs(localVer, LTSRemoteVersion, '<=', 1, localApp)
    ) {
      // Add LTS version for comparison.
      remoteVersions = remoteVersions.concat([remoteApp.app_versions[0]]);
    }
  }

  if (!remoteVersions.length) {
    remoteVersions = remoteVersions.concat([remoteApp]);
  }

  const finalForcedVuln = remoteVersions.map((remoteAppCandidate) => {
    let forcedVuln = false;

    const remoteVer = remoteAppCandidate.current_version;
    const matchDepth = normaliseDepth(remoteAppCandidate.how_to_check_versions);
    if (
      /\d/.test(remoteVer) &&
      versionBelongs(localVer, remoteVer, '<', matchDepth, localApp)
    ) {
      forcedVuln = [
        `MANA-${localAppCPE.toUpperCase()}-${remoteVer}`,
        {
          operator: '<',
          last_version: remoteVer,
          description: UNRECOGNISED_VULN_DESCRIPTION,
        },
      ];
    }

    return forcedVuln;
  });
  const finalForcedVulnNonNull = finalForcedVuln.filter((el) => el);

  return finalForcedVulnNonNull.length ? finalForcedVulnNonNull[0] : false;
}

/**
 * Add relevant vulns for each local app into "vulns" field. Only adds vulns, that current version
 * of the app is affected by.
 *
 * @param {*} localAppsDict dictionary with local apps as a pair <CPE name>:<Osquery app>.
 * @param {*} vulnsRepo list of all supported vulns.
 * @param {*} appsRepo list of all supported apps.
 * @returns a dictionary of all local apps with detected vulns.
 */
export default function mixinVulns(localAppsDict, vulnsRepo, appsRepo) {
  return Object.fromEntries(
    localAppsDict.entries().map(([localAppCPE, localApp]) => {
      // Find applicable vulns.
      // HACK for the 1st version: we support two last macOS versions and do not have ternary
      // operators, so we can't properly match vulns for LTS version of macOS.
      let vulnsWithVersions = {};
      if (localAppCPE !== 'o:apple:macos') {
        const vulns = findVulnsFor(localAppCPE, localApp, vulnsRepo, appsRepo);

        // Add affected versions info for each vuln.
        vulnsWithVersions = Object.fromEntries(
          vulns.map((vulnCVE) =>
            getAffectedVersionsFor(vulnCVE, localAppCPE, vulnsRepo)
          )
        );
      }

      // Create a simulated update for apps, that require last version installed.
      const forcedUpdate = getForcedUpdateVuln(
        localAppCPE,
        localApp,
        appsRepo[localAppCPE]
      );

      // Append last app version to the beginning, if app should be updated unconditionally.
      if (
        appsRepo[localAppCPE].update_anyway &&
        Object.keys(vulnsWithVersions).length === 0 &&
        forcedUpdate
      ) {
        const forcedUpdateId = forcedUpdate[0];
        const forcedUpdateDescription = forcedUpdate[1];
        vulnsWithVersions[forcedUpdateId] = forcedUpdateDescription;
      }

      // Save vulns with affected versions to local app meta.
      const localAppWithVulns = produce(localApp, (draft) => {
        draft.vulns = vulnsWithVersions;
      });

      return [localAppCPE, localAppWithVulns];
    })
  );
}
