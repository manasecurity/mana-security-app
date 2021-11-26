import { execFile } from 'child_process';
import { join as joinPath } from 'path';

import { OSQUERY_RUN_TIMEOUT } from '../../configs';
import { toOsqueryApp } from '../../features/appsVulnerabilities/types/osqueryApp';
import { toOsqueryOS } from '../../features/appsVulnerabilities/types/osqueryOS';
import rootPath from '../../../rootPath';

/**
 * A black magic to build an absolute path to osqueryi binary.
 * Reference:
 * https://stackoverflow.com/questions/33152533/bundling-precompiled-binary-into-electron-app
 *
 * TODO Packaging doesn't work properly: seems it can't run the command. Probably due to macOS's
 * sandbox.
 */
let binPath =
  process?.env?.NODE_ENV !== 'development'
    ? joinPath(rootPath(), 'bin')
    : joinPath(rootPath(), 'resources');
// osqueryi's path in test mode differs from others.
if (process?.env?.NODE_ENV === 'test') {
  binPath = joinPath(rootPath(), 'resources');
}
const osqueryiCmd = `${joinPath(binPath, 'osqueryi')}`;

/**
 * Spawns osqueryi process with a given SQL string.
 *
 * @param query SQL string for osqueryi binary.
 * @returns stdout from osqueryi binary.
 */
const execFilePromise = (query: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execFile(
      osqueryiCmd,
      ['--json', query],
      { timeout: OSQUERY_RUN_TIMEOUT },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(stdout);
      }
    );
  });
};

/**
 * Runs a given query against the local osqueryi binary.
 *
 * @param query SQL string for Osquery.
 * @returns a tuple with osquery's response and an error.
 */
const executeOsquery = async (query: string) => {
  try {
    const rawResult = await execFilePromise(query);
    const res = JSON.parse(rawResult);
    return { error: false, osqueryResponse: res };
  } catch (e) {
    console.error('exec failed: %O', e);
    return { error: true, osqueryResponse: false };
  }
};

/**
 * Fetches osquery apps but picks versions from a non-standard field.
 *
 * @param name app's name from "name" field.
 * @param versionField a name of the field, which has a valid app version.
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryWithVersion = async (
  name: string,
  versionField: string
) => {
  const res = await executeOsquery(`
  select bundle_name,
    ${versionField} as bundle_short_version,
    path,
    name
  from apps
  where name == '${name}'
    AND (path LIKE '/Applications/%' OR path LIKE '/Users/%/Applications/%')`);

  return res;
};

/**
 * Fetches app info for Brave Browser.
 *
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryForBrave = async () => {
  const res = await executeOsquery(`
  select bundle_name,
    bundle_short_version,
    path,
    name
  from apps
  where name == 'Brave Browser.app'
    AND (path LIKE '/Applications/%' OR path LIKE '/Users/%/Applications/%')`);

  const { error, osqueryResponse } = res;
  if (!error && osqueryResponse.length) {
    const bravesReplacedVersion = osqueryResponse.map((entry) => {
      const newVersion = entry.bundle_short_version
        .split('.')
        .slice(1)
        .join('.');
      return {
        ...entry,
        bundle_short_version: newVersion,
      };
    });

    return {
      error,
      osqueryResponse: bravesReplacedVersion,
    };
  }

  return res;
};

/**
 * Fetches app info for Bitcoin Core.
 *
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryForBitcoinCore = async () => {
  const res = await executeOsquery(`
  select bundle_name,
    bundle_short_version,
    path,
    name
  from apps
  where name == 'Bitcoin Core.app'
    AND (path LIKE '/Applications/%' OR path LIKE '/Users/%/Applications/%')`);

  const { error, osqueryResponse } = res;
  if (!error && osqueryResponse.length) {
    const btccoreReplacedVersion = osqueryResponse.map((entry) => {
      return {
        ...entry,
        name: 'Bitcoin-Qt.app',
      };
    });

    return {
      error,
      osqueryResponse: btccoreReplacedVersion,
    };
  }

  return res;
};

/**
 * Fetches app info for Telegram Swift.
 *
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryForTelegramSwift = async () => {
  const res = await executeOsquery(`
  select bundle_name,
    bundle_short_version,
    path,
    name
  from apps
  where name == 'Telegram.app'
    AND bundle_identifier == 'ru.keepcoder.Telegram'
    AND (path LIKE '/Applications/%' OR path LIKE '/Users/%/Applications/%')`);

  const { error, osqueryResponse } = res;
  if (!error && osqueryResponse.length) {
    const tgReplacedName = osqueryResponse.map((entry) => {
      return {
        ...entry,
        name: 'Telegram.app',
      };
    });

    return {
      error,
      osqueryResponse: tgReplacedName,
    };
  }

  return res;
};

/**
 * Fetches app info for Telegram Desktop (cross-platform).
 *
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryForTelegramCrossplatform = async () => {
  const res = await executeOsquery(`
  select bundle_name,
    bundle_short_version,
    path,
    name
  from apps
  where ( name == 'Telegram.app'
            OR name == 'Telegram Desktop.app'
            OR name == 'Telegram Lite.app' )
    AND ( bundle_identifier == 'org.telegram.desktop'
            OR bundle_identifier == 'com.tdesktop.Telegram' )
    AND (path LIKE '/Applications/%' OR path LIKE '/Users/%/Applications/%')`);

  const { error, osqueryResponse } = res;
  if (!error && osqueryResponse.length) {
    const tgReplacedName = osqueryResponse.map((entry) => {
      return {
        ...entry,
        name: 'Telegram Desktop.app',
      };
    });

    return {
      error,
      osqueryResponse: tgReplacedName,
    };
  }

  return res;
};

/**
 * The standard request to fetch osquery apps. Excludes apps from the response, that have a unique
 * way to store metadata.
 *
 * @returns a tuple with osquery's response and an error.
 */
const executeOsqueryForMostApps = async () => {
  const excludedAppsWhereFilter = `
    name != 'Microsoft Teams.app' AND
    name != 'Steam.app' AND
    name != 'Robo 3T.app' AND
    name != 'Telegram.app' AND
    name != 'Telegram Desktop.app' AND
    name != 'Telegram Lite.app' AND
    name != 'Bitcoin Core.app' AND
    name != 'Brave Browser.app'`;

  const res = await executeOsquery(`
  select bundle_executable,
    bundle_name,
    bundle_short_version,
    name,
    path
  from apps
  where path LIKE "/Applications/%"
    OR path LIKE "/Users/%/Applications/%"
    AND ${excludedAppsWhereFilter}`);

  return res;
};

/**
 * Fetches apps from Osquery. Includes both plain apps and OS version.
 *
 * TODO Validate JSON with jsonschema:
 * https://www.npmjs.com/package/jsonschema
 *
 * @returns list of OsqueryProduct instances.
 */
async function fetchOsquerySnapshot() {
  // Fetch all installed apps excluding exceptions.
  const { error: appsError, osqueryResponse: rawHostApps } =
    await executeOsqueryForMostApps();

  // Fetch OS version.
  const { error: osError, osqueryResponse: rawHostOS } = await executeOsquery(`
  select major,
    minor,
    patch,
    build
  from os_version
  limit 1`);

  // Fetch Microsoft Teams.
  const { error: msTeamsError, osqueryResponse: rawMsTeams } =
    await executeOsqueryWithVersion('Microsoft Teams.app', 'info_string');

  // Fetch Steam.
  const { error: steamError, osqueryResponse: rawSteam } =
    await executeOsqueryWithVersion('Steam.app', 'bundle_version');

  // Fetch Robo 3T.
  const { error: robo3TError, osqueryResponse: rawRobo3T } =
    await executeOsqueryWithVersion('Robo 3T.app', 'bundle_version');

  // Fetch Telegram.
  const { error: telegramSwiftError, osqueryResponse: rawTelegramSwift } =
    await executeOsqueryForTelegramSwift();
  const {
    error: telegramCrossPlatformError,
    osqueryResponse: rawtelegramCrossPlatform,
  } = await executeOsqueryForTelegramCrossplatform();

  // Fetch Brave Browser.
  const { error: braveError, osqueryResponse: rawBrave } =
    await executeOsqueryForBrave();

  // Fetch Bitcoin Core.
  const { error: btccoreError, osqueryResponse: rawBtccore } =
    await executeOsqueryForBitcoinCore();

  if (
    [
      appsError,
      osError,
      steamError,
      msTeamsError,
      robo3TError,
      telegramSwiftError,
      telegramCrossPlatformError,
      braveError,
      btccoreError,
    ].some((x) => x)
  ) {
    return { error: true, osqueryResponse: false };
  }

  const allRawHostApps = [
    ...rawHostApps,
    ...rawSteam,
    ...rawMsTeams,
    ...rawRobo3T,
    ...rawTelegramSwift,
    ...rawtelegramCrossPlatform,
    ...rawBrave,
    ...rawBtccore,
  ];

  const osOsquery = toOsqueryOS(rawHostOS[0]);
  const hostAppsList = allRawHostApps.map((x) => toOsqueryApp(x));
  const hostAppsListWithOS = hostAppsList.concat(osOsquery);
  return { osqueryResponse: hostAppsListWithOS, error: false };
}

export { fetchOsquerySnapshot };
