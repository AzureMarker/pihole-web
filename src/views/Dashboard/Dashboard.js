import React, { Component } from 'react';
import SummaryStats from './../../components/SummaryStats'
import QueriesGraph from './../../components/QueriesGraph'

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <SummaryStats/>
        <QueriesGraph/>
      </div>
    );
  }
}

export default Dashboard;
