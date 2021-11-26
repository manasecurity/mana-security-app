import React from 'react';
import { Image } from 'antd';

import pluralize from 'pluralize';

import noIconAppImg from '../../assets/no-icon-app.png';

const DashboardApp = (props) => {
  const { imgUrl, appName, appVulnsCount, risk = 'high' } = props;
  return (
    <div className="relative bg-white hover:bg-gray-50 h-60 p-20px">
      <Image
        className="app-icon-shadow"
        width={64}
        height={64}
        src={imgUrl}
        preview={false}
        fallback={noIconAppImg}
      />
      <div className="absolute m-20px bottom-0 left-0 right-0">
        <div className="absolute bottom-0 left-0">
          <p className="text-base">{appName}</p>
          <p className="text-base text-gray-300">
            {pluralize('vulnerability', parseInt(appVulnsCount), true)}
          </p>
        </div>
        {/* <div
          className={`absolute bottom-0 right-0 rounded-full mb-1 app-risk-${risk}`}
          role="img"
          aria-label="yo"
        /> */}
      </div>
    </div>
  );
};

export default DashboardApp;
