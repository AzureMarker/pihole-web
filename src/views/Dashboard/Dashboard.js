import React, { Component } from 'react';
import SummaryStats from './../../components/SummaryStats'

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <SummaryStats/>
      </div>
    );
  }
}

export default Dashboard;
