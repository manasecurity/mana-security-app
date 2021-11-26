import React from 'react';
import { Card, Row, Col, Button, Image, Tag } from 'antd';

import greenTickImg from '../../assets/green-tick.svg';

const PaidPlan = (props) => {
  const { switchToFreePlan } = props;
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">Your subscription</h1>
      </div>

      <Row gutter={[2, 2]} className="pr-1">
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-8">
              PRO · $59.99/year&nbsp;
              <Image
                className="mt-1"
                width={28}
                height={28}
                src={greenTickImg}
                preview={false}
              />
            </p>
            <p className="text-base pb-2">Tracks 30,000+ vulnerabilities</p>
            <p className="text-base pb-2">Supports 1000+ macOS apps</p>
            <p className="text-base pb-2">Priority email support</p>
            <p className="text-base pb-4">30 days money back guarantee</p>
            {/* <p>
              <Button
                disabled
                size="large"
                className="bg-blue-700 bg-opacity-25 text-blue-700 border-0 w-4/12"
              >
                Paid
              </Button>
            </p> */}
          </Card>
        </Col>
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-8">Community · $0</p>
            <p className="text-base pb-2">Tracks 4,000+ vulnerabilities</p>
            <p className="text-base pb-2">Supports 10 macOS apps</p>
            <p className="text-base pb-4">Email support</p>

            <Button
              className="bg-blue-700 bg-opacity-25 text-blue-700 border-0 w-4/12"
              size="large"
              onClick={switchToFreePlan}
              style={{ background: '#0A40FF14', color: '#0A40FF' }}
            >
              Switch back
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default PaidPlan;
