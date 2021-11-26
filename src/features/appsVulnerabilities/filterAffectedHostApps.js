/**
 * Filter apps with relevant vulns.
 *
 * @param {*} localAppsDict dictionary with local apps as a pair <CPE name>:<Osquery app>.
 * @returns a dictionary of all local apps, that contain vulns.
 */
export default function filterAffectedHostApps(localAppsDict) {
  return Object.fromEntries(
    Object.entries(localAppsDict).filter(
      ([k, v]) => Object.keys(v.vulns).length !== 0
    )
  );
}
