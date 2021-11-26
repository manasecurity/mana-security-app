import { exec, execSync } from 'child_process';
import { join as joinPath } from 'path';
import rootPath from '../../../rootPath';

// How much time osquery can run. After that the process will be terminated. Timeout is set in
// milliseconds.
const RUN_TIMEOUT = 3 * 1000; // 3 seconds

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
    : joinPath(rootPath(), '..', 'resources');
// osqueryi's path in test mode differs from others.
if (process?.env?.NODE_ENV === 'test') {
  binPath = joinPath(rootPath(), 'resources');
}
const osqueryiCmd = `'${joinPath(binPath, 'osqueryi')}'`;

/**
 * Executes osqueryi with a given query.
 *
 * @param {string} query - what to query from osqueryi
 * @returns output JSON-string
 */
const runQuery = (query) => {
  const osqueryCommand = [osqueryiCmd, '--json', `'${query}'`].join(' ');
  try {
    const result = execSync(osqueryCommand, {
      timeout: RUN_TIMEOUT,
    });
    return [result, false];
  } catch (error) {
    console.error(`osquery launch failed with error: %O`, error);
    return [[], true];
  }
};

/**
 * Loads a list of host's apps.
 *
 * TODO Validate JSON with jsonschema:
 * https://www.npmjs.com/package/jsonschema
 *
 * @returns JSON list with apps.
 */
const loadApps = () => {
  const [appsString, error] = runQuery(`
    select bundle_executable,
            bundle_name,
            bundle_short_version,
            bundle_version,
            display_name,
            last_opened_time,
            name,
            path
    from apps
    where path LIKE "/Applications/%" OR path LIKE "/Users/%/Applications/%"`);
  if (error) return [[], error];

  const apps = JSON.parse(appsString);
  return [apps, error];
};

const loadOS = () => {
  const [queryForOS, error] = runQuery(`
    select major,
            minor,
            patch,
            build
    from os_version
    limit 1`);
  if (error) return [{}, error];
  const osInfo = JSON.parse(queryForOS)[0];

  return [osInfo, error];
};

export { loadApps, loadOS };
