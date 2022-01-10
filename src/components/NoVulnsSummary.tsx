import React from 'react';
import { Col, Image, Row } from 'antd';
import { Link } from 'react-router-dom';

import greenTickImg from '../../assets/green-tick.svg';
import DashboardAppPromo from './DashboardAppPromo';

const NoVulnsSummary = (props) => {
  const { paid } = props;
  if (!paid) {
    const promoMessage =
      'Only 10 essential apps are covered by Community edition. Find vulnerabilities for 100+ apps with PRO subscription';
    return (
      <div className="mb-0.5">
        <div className="dashboard-item rounded-b-none mb-px mt-1">
          <div className="flex flex-row content-center justify-between">
            <div className="text-2xl leading-tight text-black">
              Essential apps are up-to-date&nbsp;
              <Image
                className="mt-1"
                width={28}
                height={28}
                src={greenTickImg}
                preview={false}
              />
            </div>
          </div>
        </div>
        <Row gutter={[2, 2]} className="rounded-b-lg overflow-hidden">
          <Col key="promo" span={24}>
            <Link to="/subscription" className="text-black-important">
              <DashboardAppPromo message={promoMessage} />
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
  return (
    <div className="mb-0.5">
      <div className="dashboard-item mb-px mt-1">
        <div className="flex flex-row content-center justify-between">
          <div className="text-2xl leading-tight text-black">
            All apps are up-to-date&nbsp;
            <Image
              className="mt-1"
              width={28}
              height={28}
              src={greenTickImg}
              preview={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVulnsSummary;
