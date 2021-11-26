import makeAppRepoAliases from '../makeAppRepoAliases';

test('aliases are being extracted from "os_query_app_name" and "aliases" fields', () => {
  const ffManaApp = {
    app_name: 'Firefox 92',
    os_query_app_name: 'Firefox',
    aliases: ['Mozilla Firefox', 'Mozilla Firefox ESR'],
  };

  expect(makeAppRepoAliases(ffManaApp).length).toBe(3);
  expect(makeAppRepoAliases(ffManaApp).includes('firefox')).toBeTruthy();
  expect(makeAppRepoAliases(ffManaApp).includes('mozilla firefox')).toBeTruthy();
  expect(makeAppRepoAliases(ffManaApp).includes('mozilla firefox esr')).toBeTruthy();
});

test('aliases do not duplicate', () => {
  const ffManaApp = {
    os_query_app_name: 'Firefox',
    aliases: ['Firefox'],
  };

  expect(makeAppRepoAliases(ffManaApp).length).toBe(1);
  expect(makeAppRepoAliases(ffManaApp).includes('firefox')).toBeTruthy();
});

test('null "aliases" field works properly', () => {
  const ffManaApp = {
    aliases: [],
    os_query_app_name: null,
  };

  expect(makeAppRepoAliases(ffManaApp).length).toBe(0);
});
