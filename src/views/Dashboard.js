/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Dashboard page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Fragment } from 'react';
import SummaryStats from '../components/SummaryStats';
import QueriesGraph from '../components/QueriesGraph';
import ClientsGraph from '../components/ClientsGraph';
import TopDomains from '../components/TopDomains';
import TopBlocked from '../components/TopBlocked';
import TopClients from '../components/TopClients';
import { api } from "../utils";

export default () => (
  <div className="animated fadeIn">
    <SummaryStats/>
    <QueriesGraph/>
    {
      api.loggedIn ?
        <Fragment>
          <ClientsGraph/>
          <div className="row">
            <TopDomains/>
            <TopBlocked/>
            <TopClients/>
          </div>
        </Fragment>
        : null
    }
  </div>
);
