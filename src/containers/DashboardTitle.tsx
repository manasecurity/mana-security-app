import React from 'react';

import pluralize from 'pluralize';

const makeSubtitleText = (
  vulnQuantRiskLevel,
  patchVeloRiskLevel,
  vulnQuant,
  patchVelo
) => {
  let allOkMsg = `Your Mac's security level is fantastic!
    Have a nice day!`;
  let vulnMsg = '';
  let patchMsg = '';

  if (vulnQuantRiskLevel === 'high') {
    vulnMsg = `Number of affected apps is extremely high.`;
  } else if (vulnQuantRiskLevel === 'medium') {
    vulnMsg = `
      There ${pluralize('is', vulnQuant, false)}
      ${pluralize('app', vulnQuant, true)}
      with a pending security patch.
    `;
  }

  if (patchVeloRiskLevel === 'high') {
    patchMsg = `Patch installation velocity has decreased a lot.`;
  } else if (patchVeloRiskLevel === 'medium') {
    patchMsg = `Patch installation velocity could be better.`;
  }

  return vulnMsg || patchMsg ? `${vulnMsg} ${patchMsg}` : allOkMsg;
};

const DashboardTitle = (props) => {
  const {
    overallRiskLevel,
    vulnQuantRiskLevel,
    patchVeloRiskLevel,
    vulnQuant,
    patchVelo,
  } = props;
  const subtitle = makeSubtitleText(
    vulnQuantRiskLevel,
    patchVeloRiskLevel,
    vulnQuant,
    patchVelo
  );
  return (
    <div>
      <h1
        className={`text-6xl risk-status-${overallRiskLevel} capitalize-first-letter`}
      >
        {overallRiskLevel} risk level
      </h1>
      <p className={`text-2xl risk-status-${overallRiskLevel}`}>{subtitle}</p>
    </div>
  );
};

export default DashboardTitle;
