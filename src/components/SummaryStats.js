/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Summary Stats component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { api, makeCancelable } from '../utils';

export default class SummaryStats extends Component {
  state = {
    blockedQueries: "---",
    totalQueries: "---",
    percentBlocked: "---",
    gravityDomains: "---",
    uniqueClients: "---"
  };

  constructor(props) {
    super(props);
    this.updateStats = this.updateStats.bind(this);
  }

  updateStats() {
    this.updateHandler = makeCancelable(api.getSummary(), { repeat: this.updateStats, interval: 5000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        blockedQueries: res.ads_blocked_today.toLocaleString(),
        totalQueries: res.dns_queries_today.toLocaleString(),
        percentBlocked: res.ads_percentage_today.toFixed(2).toLocaleString() + "%",
        gravityDomains: res.domains_being_blocked.toLocaleString(),
        uniqueClients: res.unique_clients.toLocaleString()
      });
    })
    .catch((err) => {
      if(!err.isCanceled) {
        this.setState({
          blockedQueries: "Lost",
          totalQueries: "Connection",
          percentBlocked: "To",
          gravityDomains: "API"
        });
      }
    });
  }

  componentDidMount() {
    this.updateStats();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-success">
            <div className="card-block">
              <h3>{this.state.totalQueries}</h3>
              <p style={{marginBottom: "0px"}}>{"Total Queries (" + this.state.uniqueClients + " clients)"}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-primary">
            <div className="card-block">
              <h3>{this.state.blockedQueries}</h3>
              <p style={{marginBottom: "0px"}}>Queries Blocked</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-warning">
            <div className="card-block">
              <h3>{this.state.percentBlocked}</h3>
              <p style={{marginBottom: "0px"}}>Percent Blocked</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-danger">
            <div className="card-block">
              <h3>{this.state.gravityDomains}</h3>
              <p style={{marginBottom: "0px"}}>Domains On Blocklist</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
