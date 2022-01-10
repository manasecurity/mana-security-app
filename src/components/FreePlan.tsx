import React, { useCallback } from 'react';
import { Card, Row, Col, Button, Image, Tag, Form, Input, Alert } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import greenTickImg from '../../assets/green-tick.svg';

const FreePlan = (props) => {
  const history = useHistory();
  const handleOnClick = () => history.push('/trial-activation');

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">Your subscription</h1>
      </div>

      <Row gutter={[2, 2]} className="pr-1">
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-2">PRO · $59.99/year</p>
            <p className="text-base pb-2">Supports 100+ macOS apps</p>
            <p className="text-base pb-2">Priority email support</p>
            <p className="text-base pb-2">Cancel any time</p>
            <p className="text-base">No credit card required</p>
            <p className="pt-8">
              <Button
                className="bg-opacity-25 border-0 text-base w-6/12 mr-6 blue"
                size="large"
                style={{ background: '#0A40FF14', color: '#0A40FF' }}
                onClick={handleOnClick}
              >
                Start a free 14 day trial
              </Button>

              <Link to="/code-activation" className="text-base blue">
                Add activation code
              </Link>
            </p>
          </Card>
        </Col>
        <Col span={24}>
          <Card className="rounded-md">
            <p className="text-2xl font-bold pb-2">
              Community · $0&nbsp;
              <Image
                className="mt-1"
                width={28}
                height={28}
                src={greenTickImg}
                preview={false}
              />
            </p>
            <p className="text-base pb-2">Supports 10 essential macOS apps</p>
            <p className="text-base">Email support</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default FreePlan;
