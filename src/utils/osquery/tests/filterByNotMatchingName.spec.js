import filterByNotMatchingName from '../filterByNotMatchingName';
import { OsqueryApp } from '../../../features/appsVulnerabilities/types/osqueryApp';

test('unsupported chrome should be dropped', () => {
  const ff = new OsqueryApp({
    name: 'Firefox.app',
    bundle_name: 'Firefox',
  });
  const chrome = new OsqueryApp({
    name: 'Chrome.app',
    bundle_name: 'Chrome',
  });

  const result = filterByNotMatchingName([ff, chrome], new Set(['firefox']));
  expect(result.length).toBe(1);
  expect(result[0].aliases.includes('firefox')).toBeTruthy();
  expect(result[0].aliases.length === 1).toBeTruthy();
});

test('should return an empty list if no apps are supported', () => {
  const ff = new OsqueryApp({
    name: 'Firefox.app',
    bundle_name: 'Firefox',
  });
  const result = filterByNotMatchingName([ff], new Set(['chrome']));
  expect(result.length).toBe(0);
});
