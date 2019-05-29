/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Dashboard page
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Fragment } from "react";
import SummaryStats from "../components/dashboard/SummaryStats";
import QueriesGraph from "../components/dashboard/QueriesGraph";
import ClientsGraph from "../components/dashboard/ClientsGraph";
import QueryTypesChart from "../components/dashboard/QueryTypesChart";
import UpstreamsChart from "../components/dashboard/UpstreamsChart";
import TopDomains from "../components/dashboard/TopDomains";
import TopBlockedDomains from "../components/dashboard/TopBlockedDomains";
import TopClients from "../components/dashboard/TopClients";
import api from "../util/api";
import { TimeRangeSelectorContainer } from "../components/dashboard/TimeRangeSelector";
import TopBlockedClients from "../components/dashboard/TopBlockedClients";

export default () => (
  <div className="animated fadeIn">
    {api.loggedIn ? (
      <div className="dashboard-time-selector">
        <TimeRangeSelectorContainer size="md" />
      </div>
    ) : null}
    <div className="row">
      <SummaryStats />
    </div>
    <div className="row">
      <div className="col-md-12">
        <QueriesGraph />
      </div>
    </div>
    {api.loggedIn ? (
      <Fragment>
        <div className="row">
          <div className="col-md-12">
            <ClientsGraph />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <QueryTypesChart />
          </div>
          <div className="col-lg-6 col-md-12">
            <UpstreamsChart />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <TopDomains />
          </div>
          <div className="col-lg-6 col-md-12">
            <TopBlockedDomains />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <TopClients />
          </div>
          <div className="col-lg-6 col-md-12">
            <TopBlockedClients />
          </div>
        </div>
      </Fragment>
    ) : null}
  </div>
);
