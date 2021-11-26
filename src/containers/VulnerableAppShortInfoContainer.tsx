import React from 'react';

import VulnerableAppShortInfo from '../components/VulnerableAppShortInfo';

const VulnerableAppShortInfoContainer = (props) => {
  const { hostAffectedApps, appsRepo } = props;
  const vulnItems = Object.entries(hostAffectedApps).map(([key, val], idx) => {
    const maxVersionOperator = Object.values(val.vulns)[0].operator;
    const fixedVersion = Object.values(val.vulns)[0].last_version;

    if (maxVersionOperator === '<=') {
      const solution = `later than ${fixedVersion}`;
      return (
        <VulnerableAppShortInfo
          key={key}
          app_name={appsRepo[key].app_name}
          current_version={val.currentVersion}
          solution={solution}
          cpe_id={key}
        />
      );
    }

    const solution = `${fixedVersion} or later`;
    return (
      <VulnerableAppShortInfo
        key={key}
        app_name={appsRepo[key].app_name}
        current_version={val.currentVersion}
        solution={solution}
        cpe_id={key}
      />
    );
  });

  return <div>{vulnItems}</div>;
};

export default VulnerableAppShortInfoContainer;
