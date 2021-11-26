import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Link } from 'react-router-dom';

import { Image } from 'antd';

import backImg from '../../assets/back-arrow.svg';

const SidebarIcon = () => {
  const { overallRisk } = useSelector((state) => state.analytics);
  const overallRiskLevel = overallRisk;

  return (
    <Switch>
      <Route exact path="/">
        <div
          className={`w-12 h-12 mt-8 rounded-full bg-risk-status-${overallRiskLevel}`}
        />
      </Route>
      <Route exact path="/subscription">
        <div
          className={`w-12 h-12 mt-8 rounded-full bg-risk-status-${overallRiskLevel}`}
        />
      </Route>
      <Route path="/vulns/:id">
        <Link to="/">
          <Image
            className="mt-8 pl-2 pt-3"
            width={42}
            height={42}
            src={backImg}
            preview={false}
          />
        </Link>
      </Route>
      <Route path="/code-activation">
        <Link to="/subscription">
          <Image
            className="mt-8 pl-2 pt-3"
            width={42}
            height={42}
            src={backImg}
            preview={false}
          />
        </Link>
      </Route>
    </Switch>
  );
};

export default SidebarIcon;
