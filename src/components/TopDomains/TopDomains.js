import React, { Component } from 'react';
import { escapeHtml } from './../../utils/graph_utils';

class TopDomains extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total_queries: 0,
      top_domains: {}
    };

    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    fetch("http://pi.hole:4747/stats/top_domains")
      .then(res => res.json())
      .then(res => {
        this.setState({
          total_queries: res.dns_queries_today,
          top_domains: res.top_domains
        });
      });

    setTimeout(this.updateChart, 10 * 1000);
  }

  componentDidMount() {
    this.updateChart();
  }

  render() {
    return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            Top Domains
          </div>
          <div className="card-block">
            <div style={{overflowX: "auto"}}>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Domain</th>
                    <th>Hits</th>
                    <th>Frequency</th>
                  </tr>
                  {
                    Object.keys(this.state.top_domains).map((item, index) => {
                      let stat = this.state.top_domains[item];
                      let percentage = stat / this.state.total_queries * 100;
                      return (
                        <tr key={stat}>
                          <td>
                            {escapeHtml(item)}
                          </td>
                          <td>
                            {stat}
                          </td>
                          <td>
                            <div className="progress progress-sm" title={percentage.toFixed(1) + "% of " + stat}>
                              <div className="progress-bar bg-success" style={{width: percentage + "%"}}/>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            this.state.total_queries === 0
              ?
              <div className="card-img-overlay" style={{background: "rgba(255,255,255,0.7)"}}>
                <i className="fa fa-refresh fa-spin" style={{position: "absolute", top: "50%", left: "50%", fontSize: "30px"}}/>
              </div>
              :
              null
          }
        </div>
      </div>
    );
  }
}

export default TopDomains;