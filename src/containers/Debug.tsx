import React from 'react';
import { useSelector } from 'react-redux';
import beautify from 'js-beautify';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Debug = () => {
  const localVulnApps = useSelector((state) => state.appsVulns.localVulnerableApps);
  const localApps = useSelector((state) => state.appsVulns.localApps);
  const appsRepo = useSelector((state) => state.appsVulns.appsRepo);

  const localVulnAppsJSON = beautify(JSON.stringify(localVulnApps), {
    indent_size: 2,
  });
  const localAppsJSON = beautify(JSON.stringify(localApps), {
    indent_size: 2,
  });
  const appsRepoJSON = beautify(JSON.stringify(appsRepo), {
    indent_size: 2,
  });

  return (
    <div className="h-screen overflow-y-auto">
      <h1 className="font-bold">Debug React State</h1>
      <Tabs defaultActiveKey="1" type="card" className="font-mono">
        <TabPane tab="local vulns" key="1">
          <textarea readOnly className="w-full" style={{ height: '90vh' }}>
            {localVulnAppsJSON}
          </textarea>
        </TabPane>
        <TabPane tab="local apps" key="2">
          <textarea readOnly className="w-full" style={{ height: '90vh' }}>
            {localAppsJSON}
          </textarea>
        </TabPane>
        <TabPane tab="apps repo" key="3">
          <textarea readOnly className="w-full" style={{ height: '90vh' }}>
            {appsRepoJSON}
          </textarea>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Debug;
