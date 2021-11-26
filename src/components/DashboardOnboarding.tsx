import React from 'react';

import { Row, Col } from 'antd';

const DashboardOnboarding = () => {
  return (
    <div className="dashboard h-full pr-1 pb-2">
      <div className="animate-pulse">
        <div className="pt-11 pb-6">
          <h1 className="text-6xl w-1/3 bg-gray-300 mb-2">&nbsp;</h1>
          <p className="text-2xl w-3/5 bg-gray-300">&nbsp;</p>
        </div>

        <Row gutter={[4, 4]}>
          <Col span={12}>
            <div className="dashboard-chart p-5 pb-7 h-60 flex flex-col justify-end content-end">
              <h2 className="text-2xl w-1/2 bg-gray-200">&nbsp;</h2>
              <div className="mt-auto w-full lg:w-4/5">
                <p className="text-2xl mb-3 w-1/3 bg-gray-200">&nbsp;</p>
                <p className="text-2xl w-2/3 bg-gray-200">&nbsp;</p>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="dashboard-chart p-5 pb-7 h-60 flex flex-col justify-end content-end">
              <h2 className="text-2xl w-3/4 bg-gray-200">&nbsp;</h2>
              <div className="mt-auto w-full lg:w-4/5">
                <p className="text-2xl mb-3 w-1/3 bg-gray-200">&nbsp;</p>
                <p className="text-2xl mb-3 w-10/12 bg-gray-200">&nbsp;</p>
                <p className="text-2xl w-2/3 bg-gray-200">&nbsp;</p>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mb-0.5">
          <div className="dashboard-item mb-px mt-1">
            <div className="flex flex-row content-center justify-between">
              <div className="text-2xl leading-tight text-black w-2/5 bg-gray-200">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOnboarding;
