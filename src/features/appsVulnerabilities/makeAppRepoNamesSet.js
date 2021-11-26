import makeAppRepoAliases from './makeAppRepoAliases';

/**
 * Composes a set with all supported apps' names. Includes both plain app name and its aliases.
 *
 * @param {list} appRepo a list of all supported apps.
 * @returns A set with all repo apps' names. All names are lowercase.
 */
export default function makeAppRepoNamesSet(appRepo) {
  // The app repository is a dictionary like <cpe name>:<full app object>. We only need the full
  // object, so let's drop dictionary keys.
  const appRepoVals = Object.values(appRepo);

  return appRepoVals.reduce((appSet, val) => {
    const nameAliases = makeAppRepoAliases(val);
    nameAliases.forEach((element) => {
      appSet.add(element.toLowerCase());
    });

    return appSet;
  }, new Set());
}
