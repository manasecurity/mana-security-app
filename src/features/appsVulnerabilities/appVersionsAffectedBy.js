/**
 *
 * @param {string} cve_name CVE identifier of a vuln, i.e. "CVE-2077-0001".
 * @param {string} app_cpe CPE identifier of an app, i.e. "a:mozilla:firefox".
 * @param {Dict<string, Dict<string, string>>} vulnsRepo
 * @returns
 */
export default function appVersionsAffectedBy(cve_name, app_cpe, vulnsRepo) {
  return vulnsRepo[cve_name].versions.filter((i) => i.cpe === app_cpe)[0];
}
