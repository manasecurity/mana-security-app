import { Button, Input } from 'antd';
import { ipcRenderer } from 'electron';
import React from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import persistSubscriptionThunk from '../app/persistSubscriptionThunk';
import { setKey } from '../features/subscriptionSlice/subscriptionSlice';

const CodeActivation = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const setNewKey = (event) => {
    const newKey = event.target['new-key'].value;
    dispatch(setKey({ key: newKey }));
    dispatch(persistSubscriptionThunk());
    history.push('/subscription');
  };

  const openSupportUrl = () => {
    ipcRenderer.send('url:send-email-to-support-no-activation-code');
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">Activate subscription</h1>
      </div>

      <div className="bg-white border-5px mt-2 mr-2 p-4">
        <form onSubmit={setNewKey}>
          <Input
            autoFocus
            id="new-key"
            className="mb-1 mt-4"
            placeholder="Enter your activation key from the email"
            size="large"
          />
          <p className="text-gray-400 mb-4">
            You should receive an activation key after a successful payment. If
            you did not find the code, check the spam folder or contact us
            via <a onClick={openSupportUrl}>help@manasecurity.com</a>.
          </p>
          <Input
            className="bg-opacity-25 border-0 text-base w-6/12 mb-2 cursor-pointer hover:border-0 border-transparent hover:border-transparent"
            size="large"
            style={{ background: '#0A40FF14', color: '#0A40FF' }}
            type="submit"
            value="Activate"
          />
          <Button
            className="bg-opacity-25 border-0 text-base mb-2"
            size="large"
            onClick={() => history.goBack()}
            style={{ color: '#0A40FF' }}
          >
            Return to subscription plans
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CodeActivation;
