import {
  getForcedUpdateVuln,
  UNRECOGNISED_VULN_DESCRIPTION,
} from '../mixinVulns';

test('app with version 1.2 matches with < 1.3', () => {
  const localApp = {
    currentVersion: '1.2',
  };

  const remoteApp = {
    current_version: '1.3',
    how_to_check_versions: 'major_minor_patch',
    update_anyway: true,
    app_versions: [],
  };

  const forcedVuln = getForcedUpdateVuln(
    'a:mozilla:firefox',
    localApp,
    remoteApp
  );
  const expectedResult = {
    operator: '<',
    last_version: '1.3',
    description: UNRECOGNISED_VULN_DESCRIPTION,
  };
  expect(forcedVuln).toEqual(['MANA-A:MOZILLA:FIREFOX-1.3', expectedResult]);
});

test('app with version 1.3 does not matches with < 1.3', () => {
  const localApp = {
    currentVersion: '1.3',
  };

  const remoteApp = {
    current_version: '1.3',
    how_to_check_versions: 'major_minor_patch',
    update_anyway: true,
    app_versions: [],
  };

  const forcedVuln = getForcedUpdateVuln(
    'a:mozilla:firefox',
    localApp,
    remoteApp
  );
  expect(forcedVuln).toBeFalsy();
});

test('for app with version 1.2 does not matches with range [<1.2, <2.7]', () => {
  const localApp = {
    currentVersion: '1.2',
  };

  const remoteApp = {
    current_version: '2.7',
    how_to_check_versions: 'major_minor_patch',
    update_anyway: true,
    app_versions: [
      {
        current_version: '1.2',
        how_to_check_versions: 'major_minor_patch',
      },
    ],
  };

  const forcedVuln = getForcedUpdateVuln(
    'a:mozilla:firefox',
    localApp,
    remoteApp
  );
  expect(forcedVuln).toBeFalsy();
});

test('for app with version 1.2 matches with range [<1.3, <2.7]', () => {
  const localApp = {
    currentVersion: '1.2',
  };

  const remoteApp = {
    current_version: '2.7',
    how_to_check_versions: 'major_minor_patch',
    update_anyway: true,
    app_versions: [
      {
        current_version: '1.3',
        how_to_check_versions: 'major_minor_patch',
      },
    ],
  };

  const forcedVuln = getForcedUpdateVuln(
    'a:mozilla:firefox',
    localApp,
    remoteApp
  );
  const expectedResult = {
    operator: '<',
    last_version: '1.3',
    description: UNRECOGNISED_VULN_DESCRIPTION,
  };
  expect(forcedVuln).toEqual(['MANA-A:MOZILLA:FIREFOX-1.3', expectedResult]);
});

test('for app with version 2.6 matches with range [<1.3, <2.7]', () => {
  const localApp = {
    currentVersion: '2.6',
  };

  const remoteApp = {
    current_version: '2.7',
    how_to_check_versions: 'major_minor_patch',
    update_anyway: true,
    app_versions: [
      {
        current_version: '1.2',
        how_to_check_versions: 'major_minor_patch',
      },
    ],
  };

  const forcedVuln = getForcedUpdateVuln(
    'a:mozilla:firefox',
    localApp,
    remoteApp
  );
  const expectedResult = {
    operator: '<',
    last_version: '2.7',
    description: UNRECOGNISED_VULN_DESCRIPTION,
  };
  expect(forcedVuln).toEqual(['MANA-A:MOZILLA:FIREFOX-2.7', expectedResult]);
});
