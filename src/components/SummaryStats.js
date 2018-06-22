/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Summary Stats component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { api, makeCancelable } from '../utils';

class SummaryStats extends Component {
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
        blockedQueries: res.blocked_queries.toLocaleString(),
        totalQueries: res.total_queries.toLocaleString(),
        percentBlocked: res.percent_blocked.toFixed(2).toLocaleString() + "%",
        gravityDomains: res.domains_blocked.toLocaleString(),
        uniqueClients: res.unique_clients
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
    const { t } = this.props;

    return (
      <Fragment>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-success stat-height-lock">
            <div className="card-block">
              <div className="card-icon">
                <i className="fa fa-globe fa-2x">
                </i>
              </div>
              <h3>{this.state.totalQueries}</h3>
              <p style={{marginBottom: "0px"}}>
                {t("Total Queries ({{count}} clients)", { count: this.state.uniqueClients })}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-primary stat-height-lock">
            <div className="card-block">
              <div className="card-icon">
                <i className="fa fa-hand-stop-o fa-2x">
                </i>
              </div>
              <h3>{this.state.blockedQueries}</h3>
              <p style={{marginBottom: "0px"}}>
                {t("Queries Blocked")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-warning stat-height-lock">
            <div className="card-block">
              <div className="card-icon" style={{"z-index": "100"}}>
                <i className="fa fa-pie-chart fa-2x">
                </i>
              </div>
              <h3>{this.state.percentBlocked}</h3>
              <p style={{marginBottom: "0px"}}>
                {t("Percent Blocked")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-danger stat-height-lock">
            <div className="card-block">
              <div className="card-icon">
                 <i className="fa fa-list-alt fa-2x">
                 </i>
              </div>
              <h3>{this.state.gravityDomains}</h3>
              <p style={{marginBottom: "0px"}}>
                {t("Domains On Blocklist")}
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default translate(['common', 'dashboard'])(SummaryStats);
