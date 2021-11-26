import makeAppRepoNamesSet from "../makeAppRepoNamesSet";

test('Firefox app should be reduced into a single element set with "firefox" in it', () => {
  const ffManaApp = {
    'a:mozilla:ff': {
      os_query_app_name: 'Firefox',
      aliases: [],
    },
  };
  const ffSet = makeAppRepoNamesSet(ffManaApp);
  expect(ffSet.size).toBe(1);
  expect(ffSet.has('firefox')).toBeTruthy();
});

test('Same app names should be appear only once', () => {
  const ffManaApp = {
    'a:mozilla:ff': {
      os_query_app_name: 'Firefox',
      aliases: ['firefox'],
    },
  };
  const ffSet = makeAppRepoNamesSet(ffManaApp);
  expect(ffSet.size).toBe(1);
  expect(ffSet.has('firefox')).toBeTruthy();
});

test('App aliases should be included into the result set', () => {
  const ffManaApp = {
    'a:mozilla:ff': {
      os_query_app_name: 'Firefox',
      aliases: ['firefox hd', 'firefox max pro'],
    },
  };
  const ffSet = makeAppRepoNamesSet(ffManaApp);
  expect(ffSet.size).toBe(3);
  expect(ffSet.has('firefox')).toBeTruthy();
  expect(ffSet.has('firefox hd')).toBeTruthy();
  expect(ffSet.has('firefox max pro')).toBeTruthy();
});
