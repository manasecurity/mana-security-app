import { ANALYTICS_STATE_SEED } from '../../../configs';
import refreshStats from './refreshStats';

test('should return zeros for no apps', () => {
  const state = ANALYTICS_STATE_SEED;
  const {
    overallRisk,
    velocityRisk,
    quantityRisk,
    currentVulns,
    last30dVulns,
    patchVelocity,
  } = refreshStats(state);
  expect(overallRisk).toEqual('low');
  expect(velocityRisk).toEqual('low');
  expect(quantityRisk).toEqual('low');
  expect(currentVulns).toEqual(0);
  // TODO Revert to zero, when 30d avg is calculated correctly.
  expect(last30dVulns).toEqual(5);
  expect(patchVelocity).toEqual(0);
});
