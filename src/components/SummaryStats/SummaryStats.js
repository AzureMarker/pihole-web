import React, { Component } from 'react';
import api from './../../utils/api';

class SummaryStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedQueries: 0,
      totalQueries: 0,
      percentBlocked: "0%",
      gravityDomains: 0
    };

    this.updateStats = this.updateStats.bind(this);
  }

  updateStats() {
    api.getSummary()
      .then(res => {
        this.setState({
          blockedQueries: res.ads_blocked_today.toLocaleString(),
          totalQueries: res.dns_queries_today.toLocaleString(),
          percentBlocked: res.ads_percentage_today.toFixed(2).toLocaleString() + "%",
          gravityDomains: res.domains_being_blocked.toLocaleString()
        });
      })
      .catch(() => {
        this.setState({
          blockedQueries: "Lost",
          totalQueries: "Connection",
          percentBlocked: "To",
          gravityDomains: "API"
        });
      });
    setTimeout(this.updateStats, 5000);
  }

  componentDidMount() {
    this.updateStats();
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-success">
            <div className="card-block">
              <h3>{this.state.totalQueries}</h3>
              <p style={{marginBottom: "0px"}}>Total Queries</p>
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

export default SummaryStats;