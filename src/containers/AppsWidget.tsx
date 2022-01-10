import { Row, Col } from 'antd';
import { useState } from 'hoist-non-react-statics/node_modules/@types/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import DashboardApp from '../components/DashboardApp';
import DashboardAppPromo from '../components/DashboardAppPromo';

const AppsWidget = () => {
  // eslint-disable-next-line
  const { appsRepo, localVulnerableApps } = useSelector((state) => state.appsVulns);
  const { paid } = useSelector((state) => state.subscription);

  const vulns = Object.entries(localVulnerableApps).map(([cpeKey, vuln]) => {
    const { icon, app_name } = appsRepo[cpeKey];
    const iconAsStr = icon ? `${icon}` : '';
    const appName = app_name;
    const vulnsCount = Object.keys(vuln.vulns).length;
    return {
      cpeKey,
      icon: iconAsStr,
      appName,
      vulnsCount,
    };
  });

  // If a user do not have a paid subscription, then we should add a promo in the widget.
  const blocksCount = paid ? vulns.length : vulns.length + 1;
  const additionalBlockSize = 3 - (blocksCount % 3);

  console.log(`blocks: 1st=${8 * (1 + additionalBlockSize)}`);

  let renderedVulns = vulns.map((vuln, index) => {
    // If we can't show 3 items in the last row, then the 1st app should fill the extra space.
    if (index === 0 && additionalBlockSize % 3) {
      // Calculate how many blocks are missed in the widget. Basically, there're just two options:
      // one and two blocks. E.g. if a remainder is 2 then we need to expand the size of the 1st app
      // on 1 block. And if the remainder is 1 - expand the app on 2 blocks.
      return (
        <Col key={vuln.cpeKey} span={8 * (1 + additionalBlockSize)}>
          <Link to={`/vulns/${vuln.cpeKey}`} className="text-black-important">
            <DashboardApp
              imgUrl={vuln.icon}
              appName={vuln.appName}
              appVulnsCount={vuln.vulnsCount}
              risk="high"
            />
          </Link>
        </Col>
      );
    }

    return (
      <Col key={vuln.cpeKey} span={8}>
        <Link to={`/vulns/${vuln.cpeKey}`} className="text-black-important">
          <DashboardApp
            imgUrl={vuln.icon}
            appName={vuln.appName}
            appVulnsCount={vuln.vulnsCount}
            risk="high"
          />
        </Link>
      </Col>
    );
  });

  if (!paid) {
    renderedVulns = renderedVulns.concat(
      <Col key="promo" span={8}>
        <Link to="/subscription" className="text-black-important">
          <DashboardAppPromo message="Find vulnerabilities for 100+ apps with PRO subscription" />
        </Link>
      </Col>
    );
  }

  return (
    <Row gutter={[2, 2]} className="rounded-b-lg overflow-hidden">
      {renderedVulns}
    </Row>
  );
};

export default AppsWidget;
