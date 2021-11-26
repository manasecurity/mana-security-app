import isRelevantVuln from './isRelevantVuln';

export const normaliseDepth = (depthLiteral) => {
  switch (depthLiteral) {
    case 'major_minor_patch':
      return 3;
    case 'major_minor':
      return 2;
    case 'major':
      return 1;
    default:
      return 3;
  }
};

/**
 * Finds vulns from repo, that affect current version of a given local app.
 *
 * @param {str} osqAppCPEName local app's CPE.
 * @param {Dict} osqApp local app's object from Osquery.
 * @param {Dict} vulnsRepo <CVE>:<Repo Vuln> pairs with all repo vulns.
 * @param {Dict} appsRepo <CPE>:<Repo App> pairs with all repo apps.
 * @returns sorted list of CVEs, that affect the given local app. Sorting is done by affected
 * versions: fresh versions appear before older ones.
 */
export default function findVulnsFor(
  osqAppCPEName,
  osqApp,
  vulnsRepo,
  appsRepo
) {
  try {
    // Get all vulns for the given app.
    const allAppVulns = appsRepo[osqAppCPEName].vulns;
    const matchDepth = normaliseDepth(
      appsRepo[osqAppCPEName].how_to_check_versions
    );

    // Filter vulns, that affect local app.
    let relevantVulns = allAppVulns.filter((cveName) =>
      isRelevantVuln(cveName, osqAppCPEName, osqApp, vulnsRepo, matchDepth)
    );

    return relevantVulns;
  } catch (error) {
    return [];
  }
}
