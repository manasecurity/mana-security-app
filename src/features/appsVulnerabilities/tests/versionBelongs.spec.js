import versionBelongs from '../versionBelongs';

test('1.0 < 1.1 should be true', () => {
  expect(versionBelongs('1.0', '1.1', '<')).toBeTruthy();
});

test('1.1 < 1.1 should be false', () => {
  expect(versionBelongs('1.1', '1.1', '<')).toBeFalsy();
});

test('1.0 <= 1.1 should be true', () => {
  expect(versionBelongs('1.0', '1.1', '<=')).toBeTruthy();
});

test('1.1 <= 1.1 should be true', () => {
  expect(versionBelongs('1.1', '1.1', '<=')).toBeTruthy();
});

test('1.2 <= 1.1 should be false', () => {
  expect(versionBelongs('1.2', '1.1', '<=')).toBeFalsy();
});

/**
 * Null values or incorrect version strings (e.g. without digits) should be ok.
 */
test('empty local version should not belong to <=1.0', () => {
  expect(versionBelongs(null, '1.0', '<=')).toBeFalsy();
});

test('local app should not belong to an empty remote version', () => {
  expect(versionBelongs('1.0', null, '<=')).toBeFalsy();
});

test('version "A.B.C" should not belong to <=1.0', () => {
  expect(versionBelongs('A.B.C', '1.0', '<=')).toBeFalsy();
});

/**
 * OneDrive contains leading zeros in patch version.
 */
test('versions with leading zero in patch should be ok: 1.0.01 < 1.0.02 should be true', () => {
  expect(versionBelongs('1.0.01', '1.0.02', '<')).toBeTruthy();
});

test('versions with leading zero in patch should be ok: 1.0.02 < 1.0.02 should be false', () => {
  expect(versionBelongs('1.0.02', '1.0.02', '<')).toBeFalsy();
});

test('versions with leading zero in patch should be ok: 1.0.02 <= 1.0.02 should be true', () => {
  expect(versionBelongs('1.0.02', '1.0.02', '<=')).toBeTruthy();
});

test('versions with leading zero in patch should be ok: 1.0.03 <= 1.0.02 should be false', () => {
  expect(versionBelongs('1.0.03', '1.0.02', '<=')).toBeFalsy();
});

/**
 * Versions might contain a build number besides the version. E.g. Osquery once detected Zoom with
 * '5.8.1 (1983)' version. There're at least three variations to put a build version: '1.2.3 (456)',
 * '1.2.3-456' and '1.2.3.456'.
 *
 * Examples of such apps: OneDrive, Parallels Desktop and Zoom.
 */
test('1.0.02 (1983) should belong to <=1.0.02', () => {
  expect(versionBelongs('1.0.02 (1983)', '1.0.02', '<=')).toBeTruthy();
});

test('and viceversa: 1.0.02 should belong to <=1.0.02 (1983)', () => {
  expect(versionBelongs('1.0.02', '1.0.02 (1983)', '<=')).toBeTruthy();
});

test('1.2.3-456 should belong to <=1.2.3', () => {
  expect(versionBelongs('1.2.3-456', '1.2.3', '<=')).toBeTruthy();
});

test('and viceversa: 1.2.3 should belong to <=1.2.3-456', () => {
  expect(versionBelongs('1.2.3', '1.2.3-456', '<=')).toBeTruthy();
});

test('16.29.0 should not belong to <16.29.0.57', () => {
  expect(versionBelongs('16.29.0', '16.29.0.57', '<')).toBeFalsy();
});

test('16.29.0 should belong to <16.29.1.57', () => {
  expect(versionBelongs('16.29.0', '16.29.1.57', '<')).toBeTruthy();
});

test('7.2.1.2 should belong to <=7.2.1', () => {
  expect(versionBelongs('7.2.1.2', '7.2.1', '<=')).toBeTruthy();
});

test('7.2.2.2 should not belong to <=7.2.1', () => {
  expect(versionBelongs('7.2.2.2', '7.2.1', '<=')).toBeFalsy();
});

// Compare versions limiting them to match only first two parts: major and minor. E.g.,
// 'Kindle for Mac' has "1.33.0" version in osquery and backend has "1.33.62000" for the same
// build.
test.todo('1.33.0 should belong to 1.33.62000 when passed special parameters');

test('1.2.3 with dropped patch should belong to <=1.2', () => {
  expect(versionBelongs('1.2.3', '1.2', '<=', 2)).toBeTruthy();
});

test('1.2.4 should belong to <=1.2.3 with dropped patch', () => {
  expect(versionBelongs('1.2.4', '1.2.3', '<=', 2)).toBeTruthy();
});

test('1.2 with dropped minor should belong to <=1', () => {
  expect(versionBelongs('1.2', '1', '<=', 1)).toBeTruthy();
});
