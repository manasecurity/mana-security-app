import React from 'react';
import { Card, Row, Col, Button, Image, Tag } from 'antd';

import greenTickImg from '../../assets/green-tick.svg';
import { Link } from 'react-router-dom';

const FreePlan = (props) => {
  const { openBuyLink } = props;
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">Your subscription</h1>
      </div>

      <Row gutter={[2, 2]} className="pr-1">
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-8">PRO · $59.99/year</p>
            <p className="text-base pb-2">Tracks 30,000+ vulnerabilities</p>
            <p className="text-base pb-2">Supports 1000+ macOS apps</p>
            <p className="text-base pb-2">Priority email support</p>
            <p className="text-base pb-12">30 days money back guarantee</p>
            <p className="pb-4">
              <Button
                className="bg-opacity-25 border-0 text-base w-4/12 mr-6"
                size="large"
                style={{ background: '#0A40FF14', color: '#0A40FF' }}
                onClick={openBuyLink}
              >
                Buy
              </Button>
              <Link to="/code-activation" className="text-base blue">
                Add activation code
              </Link>
            </p>
          </Card>
        </Col>
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-8">
              Community · $0&nbsp;
              <Image
                className="mt-1"
                width={28}
                height={28}
                src={greenTickImg}
                preview={false}
              />
            </p>
            <p className="text-base pb-2">Tracks 4,000+ vulnerabilities</p>
            <p className="text-base pb-2">Supports 10 essential macOS apps</p>
            <p className="text-base pb-12">Email support</p>

            {/* <Button
              disabled
              size="large"
              className="bg-blue-700 bg-opacity-25 text-blue-700 border-0 text-base w-4/12"
            >
              switch back
            </Button> */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default FreePlan;
