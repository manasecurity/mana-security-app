import appVersionsAffectedBy from './appVersionsAffectedBy';
import versionBelongs from './versionBelongs';

/**
 * Checks if a given app is affected by the vulnerability.
 *
 * @param {string} cveName CVE identifier of a vuln, i.e. "CVE-2077-0001".
 * @param {string} appCPEName CPE identifier of an app, i.e. "a:mozilla:firefox".
 * @param {Any} appObj app object from Osquery.
 * @param {List<Dict<Any, Any>} vulns all supported vulns.
 * @returns true if a given app version is affected by this vulnerability. Otherwise – false.
 */
export default function isRelevantVuln(
  cveName,
  appCPEName,
  appObj,
  vulns,
  depth
) {
  // Versions affected by a vuln can contain several affected apps. We have to drop irrelevant
  // apps. Also, there might be several
  const vulnVersion = appVersionsAffectedBy(cveName, appCPEName, vulns);

  // Compare affected version with local version.
  if (vulnVersion) {
    return versionBelongs(
      appObj.currentVersion,
      vulnVersion.last_version,
      vulnVersion.operator,
      depth,
      appObj
    );
  }

  return false;
}
