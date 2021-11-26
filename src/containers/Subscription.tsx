import { ipcRenderer } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import persistSubscriptionThunk from '../app/persistSubscriptionThunk';

import FreePlan from '../components/FreePlan';
import PaidPlan from '../components/PaidPlan';
import { resetKey } from '../features/subscriptionSlice/subscriptionSlice';

const Subscription = () => {
  const { paid } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  if (paid) {
    const switchToFreePlan = () => {
      dispatch(resetKey());
      dispatch(persistSubscriptionThunk());
    };
    return <PaidPlan switchToFreePlan={switchToFreePlan} />;
  }

  const openBuyLink = () => ipcRenderer.send('url:open-buy-link');
  return <FreePlan openBuyLink={openBuyLink} />;
};

export default Subscription;
