import React, { Component } from 'react';
import SummaryStats from './../../components/SummaryStats';
import QueriesGraph from './../../components/QueriesGraph';
import QueryTypesOverTime from './../../components/QueryTypesOverTime';
import ForwardDestOverTime from './../../components/ForwardDestOverTime';

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <SummaryStats/>
        <QueriesGraph/>
        <div className="row">
          <QueryTypesOverTime/>
          <ForwardDestOverTime/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
