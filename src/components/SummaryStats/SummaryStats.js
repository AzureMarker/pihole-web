import React, { Component } from 'react';

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
    fetch("http://pi.hole:4747/stats/summary")
      .then(res => res.json())
      .then(res => {
        this.setState({
          blockedQueries: res.ads_blocked_today.toLocaleString(),
          totalQueries: res.dns_queries_today.toLocaleString(),
          percentBlocked: res.ads_percentage_today.toLocaleString() + "%",
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
          <div className="card card-inverse card-info">
            <div className="card-block">
              <h3 className="statistic">{this.state.blockedQueries}</h3>
              <p>Queries Blocked Last 24 Hours</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-success">
            <div className="card-block">
              <h3 className="statistic">{this.state.totalQueries}</h3>
              <p>Queries Last 24 Hours</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-warning">
            <div className="card-block">
              <h3 className="statistic">{this.state.percentBlocked}</h3>
              <p>Queries Blocked Last 24 Hours</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card card-inverse card-danger">
            <div className="card-block">
              <h3 className="statistic">{this.state.gravityDomains}</h3>
              <p>Domains On Blocklists</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryStats;