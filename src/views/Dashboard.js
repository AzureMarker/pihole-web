import React from 'react';
import SummaryStats from '../components/SummaryStats';
import QueriesGraph from '../components/QueriesGraph';
import QueryTypesOverTime from '../components/QueryTypesOverTime';
import ForwardDestOverTime from '../components/ForwardDestOverTime';
import TopDomains from '../components/TopDomains';
import TopBlocked from '../components/TopBlocked';
import TopClients from '../components/TopClients';

export default () => (
  <div className="animated fadeIn">
    <SummaryStats/>
    <QueriesGraph/>
    <div className="row">
      <QueryTypesOverTime/>
      <ForwardDestOverTime/>
    </div>
    <div className="row">
      <TopDomains/>
      <TopBlocked/>
      <TopClients/>
    </div>
  </div>
);
