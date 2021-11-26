import nowUnixTime from '../../appsVulnerabilities/nowUnixTime';

const timeDelta = (a, b) => {
  if (a > b) {
    return a - b;
  }

  return 0;
};

const findFirstPatchedApp30DaysAgo = (historyVulns, days30agoUT = false) => {
  let days30ago = days30agoUT;
  if (!days30agoUT) days30ago = nowUnixTime() - 30 * 24 * 60 * 60;

  const index = historyVulns.findIndex((x) => x.patched < days30ago);
  return index === -1 ? historyVulns.length : index;
};

export const measurePatchVelocity = (nowVulns, historyVulns, nowUT = false) => {
  let nowUtc = nowUT;
  if (!nowUT) nowUtc = nowUnixTime();

  const nowVelocityPerApp = Object.values(nowVulns).map((entry) => timeDelta(nowUtc, entry.appeared));

  // History apps sorted from most recently patched to oldest.
  const lastApp = findFirstPatchedApp30DaysAgo(historyVulns);
  const historyVelocityPerApp = historyVulns
    .slice(0, lastApp)
    .map((entry) => timeDelta(entry.patched, entry.appeared));

  const finalVeloPerApp = [...nowVelocityPerApp, ...historyVelocityPerApp];
  const sum = finalVeloPerApp.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / finalVeloPerApp.length || 0);

  return avg;
};

const velocityIsHigh = (velocity, benchmark) => velocity > benchmark * 3.2;
const velocityIsMedium = (velocity, benchmark) => velocity > benchmark;

const vulnsIsHigh = (vulns, avg) => vulns > avg * 1.5;
const vulnsIsMedium = (vulns, avg) => vulns > 0;

const measureOverallRisk = (
  currentVulns,
  last30dVulns,
  patchVelocity,
  benchmarkVelocity = 24 * 60 * 60
) => {
  if (
    velocityIsHigh(patchVelocity, benchmarkVelocity) ||
    vulnsIsHigh(currentVulns, last30dVulns)
  ) {
    return 'high';
  }

  if (
    velocityIsMedium(patchVelocity, benchmarkVelocity) ||
    vulnsIsMedium(currentVulns, last30dVulns)
  ) {
    return 'medium';
  }

  return 'low';
};

const measureQuantityRisk = (currentVulns, last30dVulns) => {
  if (vulnsIsHigh(currentVulns, last30dVulns)) {
    return 'high';
  }

  if (vulnsIsMedium(currentVulns, last30dVulns)) {
    return 'medium';
  }

  return 'low';
};

const measureVelocityRisk = (
  patchVelocity,
  benchmarkVelocity = 24 * 60 * 60
) => {
  if (velocityIsHigh(patchVelocity, benchmarkVelocity)) {
    return 'high';
  }

  if (velocityIsMedium(patchVelocity, benchmarkVelocity)) {
    return 'medium';
  }

  return 'low';
};

/**
 * Recalculates current patching stats: risk, # of current vulns, avg. # of vulns (30d) and patch
 * velocity (in minutes).
 *
 * @param {*} state - an state of analyticalSlice.
 * @returns {Object} returns a dictionary with four elements: risk (str),
 * # of current vulns (integer), avg. # of vulns (30d; integer) and patch velocity (in minutes;
 * integer).
 */
export default function refreshStats(state) {
  const currentVulns = Object.keys(state.localAffectedAppsForAnalytics).length;
  const last30dVulns = 5;
  const patchVelocity = measurePatchVelocity(
    state.localAffectedAppsForAnalytics,
    state.updateHistory
  );
  const overallRisk = measureOverallRisk(
    currentVulns,
    last30dVulns,
    patchVelocity
  );
  const velocityRisk = measureVelocityRisk(patchVelocity);
  const quantityRisk = measureQuantityRisk(currentVulns, last30dVulns);
  return {
    overallRisk,
    velocityRisk,
    quantityRisk,
    currentVulns,
    last30dVulns,
    patchVelocity,
  };
}
