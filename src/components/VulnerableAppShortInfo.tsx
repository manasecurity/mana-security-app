import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const VulnerableAppShortInfo = (props) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { app_name, current_version, solution, cpe_id } = props;

  return (
    <div className="pb-2">
      <p>
        App: {app_name}, version {current_version}
      </p>
      <p>Fixed version: {solution}</p>
      <Link to={`/vulns/${cpe_id}`}>Details</Link>
    </div>
  );
};

VulnerableAppShortInfo.propTypes = {
  app_name: PropTypes.string.isRequired,
  cpe_id: PropTypes.string.isRequired,
  current_version: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
};

export default VulnerableAppShortInfo;
