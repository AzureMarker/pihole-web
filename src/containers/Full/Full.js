import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Aside from '../../components/Aside';
import Footer from '../../components/Footer';
import Dashboard from '../../views/Dashboard';
import QueryLog from '../../components/QueryLog';
import Whitelist from '../../views/Whitelist';

export default class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Redirect exact from="/" to="/dashboard"/>
                <Route path="/query-log" name="Query Log" component={QueryLog}/>
                <Route path="/whitelist" name="Whitelist" component={Whitelist}/>
              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}
