import React, { Component } from 'react';
import SummaryStats from './../../components/SummaryStats'
import QueriesGraph from './../../components/QueriesGraph'
import QueryTypesOverTime from './../../components/QueryTypesOverTime'

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <SummaryStats/>
        <QueriesGraph/>
        <div className="row">
          <QueryTypesOverTime/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
