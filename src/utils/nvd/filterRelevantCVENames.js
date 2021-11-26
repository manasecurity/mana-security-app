/**
 * Finds all vulns' CVEs, that affect a given app.
 *
 * @param {str} appCPE app's name in CPE format.
 * @param {List<Dict>} vulns repo of vulns.
 * @returns List of strings each containing a CVE id.
 */
export default function filterRelevantCVENames(appCPE, vulns) {
  return vulns.reduce((buff, vuln) => {
    if (vuln.versions.filter(x => x.cpe === appCPE).length) {
      buff.push(vuln.cve);
    }
    return buff;
  }, []);
}
