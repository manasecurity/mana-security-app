import React from 'react';
import { useSelector } from 'react-redux';

import { Row, Col } from 'antd';

import AppsWidget from './AppsWidget';
import DashboardTitle from './DashboardTitle';
import VulnsSummary from '../components/VulnsSummary';
import NoVulnsSummary from '../components/NoVulnsSummary';
import DashboardOnboarding from '../components/DashboardOnboarding';

const secondsToHumanDays = (seconds, prefix = '') => {
  const days = seconds / (60 * 60 * 24);
  return days < 1 ? '< 1' : `${prefix}${Math.round(days)}`;
};

const normaliseDataset = (iterable) => {
  const max = Math.max(...iterable);
  return iterable.map((entry) => entry / max * 100);
};

const Dashboard = () => {
  const { firstLaunch } = useSelector((state) => state.status);
  const { paid } = useSelector((state) => state.subscription);

  const hostAffectedApps = useSelector(
    (state) => state.appsVulns.localVulnerableApps
  );
  const {
    overallRisk,
    velocityRisk,
    quantityRisk,
    benchmarkVelocity,
    otherUsersVelocity,
    patchVelocity,
    last30dVulns,
    currentVulns,
  } = useSelector((state) => state.analytics);
  const affectAppsCount = Object.keys(hostAffectedApps).length;

  if (firstLaunch) {
    return <DashboardOnboarding />;
  }

  const overallRiskLevel = overallRisk;
  const vulnQuantRiskLevel = quantityRisk;
  const patchVeloRiskLevel = velocityRisk;

  // Calculating bar sizes for vulnerability quantity.
  const [nCurrentVulns, nLast30dVulns] = normaliseDataset([
    currentVulns,
    last30dVulns,
  ]);

  // Calculating bar sizes for patching velocity.
  const [nPatchVelocity, nOtherUsersVelocity, nBenchmarkVelocity] =
    normaliseDataset([patchVelocity, otherUsersVelocity, benchmarkVelocity]);

  return (
    <div className="dashboard h-full pr-1 pb-2">
      <div className="pt-11 pb-6">
        <DashboardTitle
          overallRiskLevel={overallRiskLevel}
          vulnQuantRiskLevel={vulnQuantRiskLevel}
          patchVeloRiskLevel={patchVeloRiskLevel}
          vulnQuant={currentVulns}
          patchVelo={patchVelocity}
        />
      </div>

      <Row gutter={[4, 4]}>
        <Col span={12}>
          <div className="dashboard-chart p-5 pb-7 h-60 flex flex-col justify-end content-end">
            <h2 className="text-2xl">Vulnerabilities</h2>
            <div className="mt-auto w-full lg:w-4/5">
              <p className={`text-2xl mb-1 risk-status-${vulnQuantRiskLevel}`}>
                {currentVulns} · Now
              </p>
              <div
                className={`border-b-2 min-w-chart border-risk-status-${vulnQuantRiskLevel} mb-3`}
                style={{ width: `${nCurrentVulns}%` }}
              />
              <p className="text-base mb-1">{last30dVulns} · Average</p>
              <div
                className="border-b-2 border-black min-w-chart"
                style={{ width: `${nLast30dVulns}%` }}
              />
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="dashboard-chart p-5 pb-7 h-60 flex flex-col justify-end content-end">
            <h2 className="text-2xl">
              Update speed <span className="text-gray-400">in days</span>
            </h2>
            <div className="mt-auto w-full lg:w-4/5">
              <p className={`text-2xl mb-1 risk-status-${patchVeloRiskLevel}`}>
                {secondsToHumanDays(patchVelocity, '~')} · You
              </p>
              <div
                className={`border-b-2 mb-3 min-w-chart border-risk-status-${patchVeloRiskLevel}`}
                style={{ width: `${nPatchVelocity}%` }}
              />
              <p className="text-base mb-1">
                {secondsToHumanDays(otherUsersVelocity)} · Community
              </p>
              <div
                className="border-b-2 border-black mb-3 min-w-chart"
                style={{ width: `${nOtherUsersVelocity}%` }}
              />
              <p className="text-base mb-1">
                {secondsToHumanDays(benchmarkVelocity)} · Benchmark
              </p>
              <div
                className="border-b-2 border-black min-w-chart"
                style={{ width: `${nBenchmarkVelocity}%` }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {currentVulns > 0 ? (
        <VulnsSummary affectAppsCount={affectAppsCount} />
      ) : (
        <NoVulnsSummary paid={paid} />
      )}

      {currentVulns > 0 ? <AppsWidget /> : ''}
    </div>
  );
};

export default Dashboard;
