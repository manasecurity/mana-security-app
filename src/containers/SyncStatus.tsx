import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Image } from 'antd';

import offlineImg from '../../assets/offline.svg';
import syncImg from '../../assets/sync.svg';

const SyncStatus = () => {
  const appState = useSelector((state) => state);
  const isOnline = appState?.vulnApi?.config?.online;
  const isSync = appState?.status?.syncInProgress;

  if (!isOnline) {
    return (
      <span>
        <Image
          className="mt-0.5"
          width={16}
          height={16}
          src={offlineImg}
          preview={false}
        />
        &nbsp;No internet
      </span>
    );
  }

  if (isSync) {
    return (
      <span>
        <Image
          className="mt-0.5 animate-spin"
          width={16}
          height={16}
          src={syncImg}
          preview={false}
        />
        &nbsp;Synchronizing...
      </span>
    );
  }

  return <span />;
};

export default SyncStatus;
