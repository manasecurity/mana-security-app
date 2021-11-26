import React from 'react';
import { useSelector } from 'react-redux';

import VulnerableAppShortInfoContainer from './VulnerableAppShortInfoContainer';

const VulnerableAppsList = () => {
  const hostAffectedApps = useSelector(
    (state) => state.appsVulns.localVulnerableApps
  );
  const appsRepo = useSelector((state) => state.appsVulns.appsRepo);

  return (
    <div className="overflow-y-auto h-screen">
      <h1 className="capitalize font-bold">Vulnerable apps on your Mac</h1>
      <VulnerableAppShortInfoContainer
        hostAffectedApps={hostAffectedApps}
        appsRepo={appsRepo}
      />
    </div>
  );
};

export default VulnerableAppsList;
