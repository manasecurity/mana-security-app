import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { shell } from 'electron';
import pluralize from 'pluralize';
import ReactMarkdown from 'react-markdown';

import VulnerabilityInfo from '../components/VulnerabilityInfo';

const VulnerableAppFullInfo = (props) => {
  // eslint-disable-next-line
  const { app_name, cpe, current_version, solution, path, allVulns, howToUpdate } = props;
  // eslint-disable-next-line
  const renderedVulns = Object.entries(allVulns).map(([vulnId, x], index) => {
    return (
      <Col key={vulnId} span={24}>
        <VulnerabilityInfo vulnIndex={index + 1} description={x.description} />
      </Col>
    );
  });

  const showAppInFinder = () => {
    console.log('yo');
    shell.showItemInFolder(path);
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">{app_name}</h1>
        <p className="text-6xl text-gray-400">
          {pluralize('vulnerability', Object.entries(allVulns).length, true)}
        </p>
        {/* <p className="absolute bottom-6 right-0 text-6xl lowercase pr-4">
          <button
            type="submit"
            className="text-red-important hover:border-0"
            onClick={showAppInFinder}
          >
            show in finder
          </button>
        </p> */}
      </div>

      <Row gutter={[2, 2]} className="pr-1">
        <Col span={24}>
          <Card className="rounded-md select-text">
            <p className="text-2xl capitalize-first-letter pb-8">{solution}</p>
            <ReactMarkdown className="text-base capitalize-first-letter whitespace-pre-line pb-4">
              {'*How to install the update:*\n'.concat(howToUpdate)}
            </ReactMarkdown>
            <Button
              type="primary"
              className="bg-blue-700 border-blue-700"
              onClick={showAppInFinder}
            >
              show app in finder
            </Button>
          </Card>
        </Col>
        {renderedVulns}
      </Row>
    </div>
  );
};

export default VulnerableAppFullInfo;
