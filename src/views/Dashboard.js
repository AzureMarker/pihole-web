/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Dashboard page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

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
