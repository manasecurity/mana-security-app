import React from 'react';
import { useParams, Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import VulnerableAppFullInfo from './VulnerableAppFullInfo';

const VulnerableAppFullInfoContainer = () => {
  const { id } = useParams();
  const affectedLocalApp = useSelector(
    (state) => state.appsVulns.localVulnerableApps[id]
  );
  const affectedApp = useSelector((state) => state.appsVulns.appsRepo[id]);
  if (!affectedLocalApp) return <Redirect to="/" />;

  const { operator } = Object.values(affectedLocalApp.vulns)[0];
  const maxAffectedVersion = Object.values(affectedLocalApp.vulns)[0]
    .last_version;
  const vulnDescription = Object.values(affectedLocalApp.vulns)[0].description;

  if (operator === '<=') {
    const solution = `Upgrade to version later than ${maxAffectedVersion}`;
    return (
      <VulnerableAppFullInfo
        cpe={id}
        cpe_vendor={affectedApp.cpe_vendor}
        app_name={affectedApp.app_name}
        vuln_description={vulnDescription}
        current_version={affectedLocalApp.currentVersion}
        solution={solution}
        path={affectedLocalApp.path}
        allVulns={affectedLocalApp.vulns}
        howToUpdate={affectedApp.how_to_update}
      />
    );
  }

  const solution = `update to version ${maxAffectedVersion} or newer`;
  return (
    <VulnerableAppFullInfo
      cpe={id}
      cpe_vendor={affectedApp.cpe_vendor}
      app_name={affectedApp.app_name}
      vuln_description={vulnDescription}
      current_version={affectedLocalApp.currentVersion}
      solution={solution}
      path={affectedLocalApp.path}
      allVulns={affectedLocalApp.vulns}
      howToUpdate={affectedApp.how_to_update}
    />
  );
};

export default VulnerableAppFullInfoContainer;
