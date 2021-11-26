import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';

const VulnsSummary = (props) => {
  const { affectAppsCount } = props;
  return (
    <div className="mb-0.5">
      <div className="dashboard-item rounded-b-none mb-px mt-1">
        <div className="flex flex-row content-center justify-between">
          <div className="text-2xl leading-tight text-black">
            {pluralize('app', affectAppsCount, true)}{' '}
            {affectAppsCount === 1 ? 'needs' : 'need'} an update
          </div>
        </div>
      </div>
    </div>
  );
};

VulnsSummary.propTypes = {
  affectAppsCount: PropTypes.number.isRequired,
};

export default VulnsSummary;
