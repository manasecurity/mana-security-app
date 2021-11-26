import { OsqueryApp } from '../types/osqueryApp';

test('should return "name" and "bundle_name" field', () => {
  const ff = new OsqueryApp({
    name: 'Firefox',
    bundle_name: 'Mozilla Firefox',
  });

  expect(ff.aliases.length).toBe(2);
  expect(ff.aliases.includes('firefox')).toBeTruthy();
  expect(ff.aliases.includes('mozilla firefox')).toBeTruthy();
});

test('should trim ".app" ending in the "name" andfield', () => {
  const ff = new OsqueryApp({
    name: 'Firefox.app',
    bundle_name: 'Mozilla Firefox',
  });

  expect(ff.aliases.length).toBe(2);
  expect(ff.aliases.includes('firefox')).toBeTruthy();
  expect(ff.aliases.includes('mozilla firefox')).toBeTruthy();
});

test('should contain only unique app names', () => {
  const ff = new OsqueryApp({
    name: 'Firefox.app',
    bundle_name: 'Firefox',
  });

  expect(ff.aliases.length).toBe(1);
  expect(ff.aliases.includes('firefox')).toBeTruthy();
});
