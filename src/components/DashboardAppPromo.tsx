import React from 'react';
import { Image } from 'antd';

import proPlanImg from '../../assets/pro-plan-promo.svg';

const DashboardAppPromo = (props) => {
  const { message } = props;
  return (
    <div className="relative bg-white hover:bg-gray-50 h-60 p-20px cursor-pointer">
      <Image
        className="app-icon-shadow"
        width={64}
        height={64}
        src={proPlanImg}
        preview={false}
        fallback={proPlanImg}
      />
      <div className="absolute m-20px bottom-0 left-0 right-0">
        <div className="absolute bottom-0 left-0">
          <p className="text-base">{message}</p>
          <p className="text-base text-gray-300">Upgrade to PRO</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAppPromo;
