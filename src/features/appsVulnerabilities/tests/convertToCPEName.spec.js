const { default: convertToCPEName } = require('../convertToCPEName');
const { OsqueryApp } = require('../types/osqueryApp');

test('firefox should be translated into "mozilla:firefox"', () => {
  const ffOsqApp = new OsqueryApp({
    name: 'Firefox',
    bundle_name: 'Mozilla Firefox',
  });
  const ffManaApp = {
    cpe_part: 'a',
    cpe_vendor: 'mozilla',
    cpe_product: 'firefox',
    os_query_app_name: 'Firefox',
    aliases: ['Mozilla Firefox', 'Mozilla Firefox ESR'],
  };
  expect(
    convertToCPEName(ffOsqApp, { 'a:mozilla:firefox': ffManaApp })
  ).toEqual('a:mozilla:firefox');
});

test('chrome should be translated into "google:chrome" given two supported apps', () => {
  const chromeOsqApp = new OsqueryApp({
    name: 'Google Chrome.app',
    bundle_name: 'Chrome',
  });

  const ffManaApp = {
    cpe_part: 'a',
    cpe_vendor: 'mozilla',
    cpe_product: 'firefox',
    os_query_app_name: 'Firefox',
    aliases: ['Mozilla Firefox', 'Mozilla Firefox ESR'],
  };

  const chromeManaApp = {
    cpe_part: 'a',
    cpe_vendor: 'google',
    cpe_product: 'chrome',
    os_query_app_name: 'chrome',
    aliases: ['Google Chrome'],
  };

  const manaAppRepo = {
    'a:mozilla:firefox': ffManaApp,
    'a:google:chrome': chromeManaApp,
  };

  expect(convertToCPEName(chromeOsqApp, manaAppRepo)).toEqual(
    'a:google:chrome'
  );
});

test('not supported app should be translated into null', () => {
  const ffOsqApp = new OsqueryApp({
    name: 'Firefox',
    bundle_name: 'Mozilla Firefox',
  });

  const chromeManaApp = {
    cpe_part: 'a',
    cpe_vendor: 'google',
    cpe_product: 'chrome',
    os_query_app_name: 'Google Chrome',
    aliases: ['chrome'],
  };

  expect(
    convertToCPEName(ffOsqApp, { 'a:google:chrome': chromeManaApp })
  ).toEqual(null);
});
