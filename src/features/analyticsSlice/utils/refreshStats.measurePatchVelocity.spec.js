import nowUnixTime from '../../appsVulnerabilities/nowUnixTime';
import { measurePatchVelocity } from './refreshStats';

test('app affected 30 days ago equals to 30d avg velocity', () => {
  const nowUtc = nowUnixTime();
  const ago30days = nowUtc - 30 * 24 * 60 * 60;
  const nowVulns = {
    'a:ff:ff': { appeared: ago30days },
  };
  expect(measurePatchVelocity(nowVulns, [], nowUtc)).toEqual(30 * 24 * 60 * 60);
});

test('two apps affected 2 and 4 mins ago equals to 3m avg velocity', () => {
  const nowUtc = nowUnixTime();
  const ago2mins = nowUtc - 2 * 60;
  const ago4mins = nowUtc - 4 * 60;
  const nowVulns = {
    'a:ff:ff': { appeared: ago2mins },
    'a:google:chrome': { appeared: ago4mins },
  };
  expect(measurePatchVelocity(nowVulns, [], nowUtc)).toEqual(3 * 60);
});

test('past app patched in 1 day equals to 1d avg velocity', () => {
  const nowUtc = nowUnixTime();
  const ago2days = nowUtc - 2 * 24 * 60 * 60;
  const ago1day = nowUtc - 1 * 24 * 60 * 60;
  const historyVulns = [{ appeared: ago2days, patched: ago1day }];
  expect(measurePatchVelocity({}, historyVulns, nowUtc)).toEqual(24 * 60 * 60);
});

test('past apps patched in 3 and 1 days equals to 2d avg velocity', () => {
  const nowUtc = nowUnixTime();
  const ago4days = nowUtc - 4 * 24 * 60 * 60;
  const ago2days = nowUtc - 2 * 24 * 60 * 60;
  const ago1day = nowUtc - 1 * 24 * 60 * 60;
  const historyVulns = [
    { appeared: ago4days, patched: ago1day },
    { appeared: ago2days, patched: ago1day },
  ];
  expect(measurePatchVelocity({}, historyVulns, nowUtc)).toEqual(2 * 24 * 60 * 60);
});

test('only apps patched within last 30 days count', () => {
  const nowUtc = nowUnixTime();
  const ago33days = nowUtc - 33 * 24 * 60 * 60;
  const ago31days = nowUtc - 31 * 24 * 60 * 60;
  const ago2days = nowUtc - 2 * 24 * 60 * 60;
  const ago1day = nowUtc - 1 * 24 * 60 * 60;
  const historyVulns = [
    { appeared: ago2days, patched: ago1day },
    { appeared: ago33days, patched: ago31days },
  ];
  expect(measurePatchVelocity({}, historyVulns, nowUtc)).toEqual(24 * 60 * 60);
});

test(`past app patched within 6 minutes and an active app flowed 4 mins ago
equals to 5m avg velocity`, () => {
  expect(1).toBeTruthy();
  const nowUtc = nowUnixTime();

  // App appeared 4 minutes ago.
  const ago4mins = nowUtc - 4 * 60;
  const nowVulns = {
    'a:google:chrome': { appeared: ago4mins },
  };

  // Another app was patched within 6 minutes.
  const ago10mins = nowUtc - 10 * 60;
  const historyVulns = [{ appeared: ago10mins, patched: ago4mins }];

  // Results in 5m of average velocity.
  expect(measurePatchVelocity(nowVulns, historyVulns, nowUtc)).toEqual(5 * 60);
});
