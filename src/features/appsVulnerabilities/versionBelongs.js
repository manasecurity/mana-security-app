import semver from 'semver';

const matchDepth = (ver, depth) => {
  const coercedVer = semver.coerce(ver, { loose: true });
  const validDepth = depth >= 1 && depth <= 3 ? depth : 3;
  if (!semver.valid(coercedVer)) {
    console.error(`invalid ver=${ver}`);
    return ver;
  }

  const { major, minor, patch } = coercedVer;

  return [major, minor, patch].slice(0, validDepth).join('.');
};

/**
 * Detects if local app's version belongs to vulnerable versions.
 *
 * @param {string} localVer local app version
 * @param {string} affectedMaxVer max vulnerable version
 * @param {string} operator include or exclude current version. Might be "<" or "<="
 * @param {integer} depth which parts of versions to compare. Varies in a range of [1...3]. Defaults
 * to 3, i.e. major, minor and patch should be taken into account.
 * @returns true if local app is affected. Otherwise, returns false.
 */
export default function versionBelongs(
  localVer,
  affectedMaxVer,
  operator,
  depth = 3,
  localApp = false
) {
  const localVerWithDepth = matchDepth(localVer, depth);
  const affectedMaxVerWithDepth = matchDepth(affectedMaxVer, depth);
  try {
    if (operator === '<') {
      return semver.lt(
        semver.coerce(localVerWithDepth, { loose: true }),
        semver.coerce(affectedMaxVerWithDepth, { loose: true })
      );
    }
    if (operator === '<=') {
      return semver.lte(
        semver.coerce(localVerWithDepth, { loose: true }),
        semver.coerce(affectedMaxVerWithDepth, { loose: true })
      );
    }
    console.error(
      `Unsupported versions or operator:
        localVer=${localVer},
        affectedMaxVer=${affectedMaxVer},
        operator=${operator}
        depth=${depth}`
    );
  } catch(e) {
    console.error(
      'Failed during version processing version "%O" for app %O with error: %O',
      localVer,
      localApp,
      e
    );
  }
  return false;
}
