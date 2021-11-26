/**
 * Filters out osquery apps that Mana doesn't supports.
 *
 * @param {List<OsqueryApp>} hostAppsList list of osquery apps
 * @param {Set<String>} appRepoNamesSet set with names of all supported apps.
 * @returns List of osquery apps that are supported by Mana.
 */
export default function filterByNotMatchingName(hostAppsList, appRepoNamesSet) {
  return hostAppsList.filter((x) =>
    x.aliases.some((y) => appRepoNamesSet.has(y))
  );
}
