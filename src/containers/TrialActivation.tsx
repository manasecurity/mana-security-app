import { Button, Input } from 'antd';
import { ipcRenderer } from 'electron';
import React from 'react';

import { useHistory } from 'react-router';

const TrialActivation = () => {
  const history = useHistory();

  const getTrial = (event) => {
    const email = event.target.email.value;
    ipcRenderer.send('url:get-trial-link', { email });
    history.push('/code-activation');
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden h-full pb-4">
      <div className="relative pt-11 pb-6">
        <h1 className="text-6xl">Start trial</h1>
      </div>
      <div className="bg-white border-5px mr-2 p-4">
        <form onSubmit={getTrial}>
          <p className="mb-2">Email:</p>
          <Input
            autoFocus
            id="email"
            className="mb-1"
            placeholder=""
            size="large"
            type="email"
          />
          <p className="text-gray-400 mb-4">
            We will only use this address to contact you about security or
            billing changes on your account. No marketing emails, no sales
            emails, nothing like that.
          </p>
          <Input
            className="bg-opacity-25 border-0 text-base w-6/12 mb-2 cursor-pointer hover:border-0 border-transparent hover:border-transparent"
            size="large"
            style={{ background: '#0A40FF14', color: '#0A40FF' }}
            type="submit"
            value="Get activation code"
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

export default TrialActivation;
