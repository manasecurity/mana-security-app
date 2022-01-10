/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import { Space, Layout, Image } from 'antd';

// import icon from '../assets/icon.svg';
import './App.global.css';
import Dashboard from './containers/Dashboard';
import VulnerableAppFullInfoContainer from './containers/VulnerableAppFullInfoContainer';
import VulnerableAppsList from './containers/VulnerableAppsList';
import SidebarIcon from './containers/SidebarIcon';
import houseImg from '../assets/house.svg';
import tickImg from '../assets/tick.svg';

import Debug from './containers/Debug';
import SyncStatus from './containers/SyncStatus';
import osqueryRefreshThunk from './app/osqueryRefreshThunk';
import syncRepoThunk from './app/repoThunk';
import Subscription from './containers/Subscription';
import CodeActivation from './containers/CodeActivation';
import TrialActivation from "./containers/TrialActivation";

const { Header, Sider, Content } = Layout;

class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      const { osqueryRefreshThunk, syncRepoThunk } = this.props;
      osqueryRefreshThunk();
      syncRepoThunk();
    }, 1000);
  }

  render() {
    return (
      <Router>
        <Layout
          className="bg-mana-gray select-none h-screen"
          style={{ transition: 'visibility 0s, opacity 1s linear' }}
        >
          <Header
            className="fixed
            w-screen
            bg-gray-100
            bg-gray-100
            opacity-90
            backdrop-filter
            backdrop-blur-3xl
            backdrop-saturate-200
            left-0
            right-0
            top-0
            window-header
            z-50

            flex
            justify-end
            items-center
            p-0
            pr-4
            "
            style={{ height: '38px' }}
          >
            <SyncStatus />
          </Header>
          <Layout className="bg-mana-gray select-none mt-10">
            <Sider className="bg-mana-gray p-5" width={200}>
              <div className="flex flex-col justify-between h-full">
                <SidebarIcon />
                <div />
                <Space direction="vertical">
                  <NavLink
                    exact
                    to="/"
                    activeClassName="text-gray-important"
                    className="text-black-important text-2xl"
                  >
                    <Space align="center" className="hover:text-gray-500">
                      <Image
                        className="mt-0.5"
                        width={21}
                        height={21}
                        src={houseImg}
                        preview={false}
                      />
                      home
                    </Space>
                  </NavLink>

                  {/* <Link to="/vulns">
                    <Space
                      align="center"
                      className="text-black hover:text-gray-500"
                    >
                      <Image
                        className="mt-0.5"
                        width={21}
                        height={21}
                        src={vulnsImg}
                        preview={false}
                      />
                      <div className="text-2xl">vulnerabilities</div>
                    </Space>
                  </Link> */}

                  <NavLink
                    to="/subscription"
                    activeClassName="text-gray-important"
                    className="text-black-important text-2xl"
                  >
                    <Space align="center" className="hover:text-gray-500">
                      <Image
                        className="mt-0.5"
                        width={21}
                        height={21}
                        src={tickImg}
                        preview={false}
                      />
                      subscription
                    </Space>
                  </NavLink>

                  {process.env.NODE_ENV === 'development' &&
                    <NavLink
                      exact
                      to="/debug"
                      activeClassName="text-gray-important"
                      className="text-black-important text-2xl"
                    >
                      <Space
                        align="center"
                        className="text-black hover:text-gray-500"
                      >
                        <Image
                          className="mt-0.5 transform rotate-180"
                          width={21}
                          height={21}
                          src={houseImg}
                          preview={false}
                        />
                        debug
                      </Space>
                    </NavLink>
                  }

                </Space>
              </div>
            </Sider>
            <Layout className="bg-mana-gray select-none h-full overflow-x-hidden">
              <Content>
                <Switch>
                  <Route exact path="/">
                    <Dashboard />
                  </Route>
                  <Route exact path="/vulns">
                    <VulnerableAppsList />
                  </Route>
                  <Route path="/vulns/:id">
                    <VulnerableAppFullInfoContainer />
                  </Route>
                  {/* <Route path="/hardening" component={Hardening} /> */}
                  <Route path="/subscription" component={Subscription} />
                  <Route path="/code-activation" component={CodeActivation} />
                  <Route path="/trial-activation" component={TrialActivation} />
                  <Route path="/debug" component={Debug} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching actions returned by action creators
    osqueryRefreshThunk: () => dispatch(osqueryRefreshThunk()),
    syncRepoThunk: () => dispatch(syncRepoThunk()),
  };
};

export default connect(null, mapDispatchToProps)(App);
