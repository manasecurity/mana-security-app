import makeAppRepoAliases from './makeAppRepoAliases';

/**
 * Converts osquery app's names to a CPE name. E.g. "Firefox" will be converted to
 * "mozilla:firefox".
 *
 * @param {Dictionary<String, String>} osqApp a host app from osquery.
 * @param {Dictionary<String, Dictionary<String, String>>} manaAppsRepo list of supported apps.
 * @returns string with CPE-like name. If the app is not supported, returns null.
 */
export default function convertToCPEName(osqApp, manaAppsRepo) {
  // Make a set from osquery app's names.
  const osqAppAliases = new Set(osqApp.aliases);

  // Drop keys from mana apps' repo dictionary.
  const manaAppsList = Object.values(manaAppsRepo);

  // Find an appropriate pair for osquery app among apps supported by Mana.
  const foundEntry = manaAppsList.find((manaApp) => {
    // First, construct a set from mana app names.
    const manaAppAliases = new Set(makeAppRepoAliases(manaApp));

    // And check if there any intersections among mana app's names and osquery's ones.
    return (
      new Set([...manaAppAliases].filter((i) => osqAppAliases.has(i))).size > 0
    );
  });

  if (foundEntry) {
    return `${foundEntry.cpe_part}:${foundEntry.cpe_vendor}:${foundEntry.cpe_product}`;
  }
  return null;
}
