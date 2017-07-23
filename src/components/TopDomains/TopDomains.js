import React, { Component } from 'react';
import { api, makeCancelable } from '../../utils';

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
    this.updateHandler = makeCancelable(api.getTopDomains(), { repeat: this.updateChart, interval: 10 * 1000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        total_queries: res.dns_queries_today,
        top_domains: res.top_domains
      });
    });
  }

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
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
                        <tr key={item}>
                          <td>
                            {item}
                          </td>
                          <td>
                            {stat.toLocaleString()}
                          </td>
                          <td>
                            <div className="progress progress-sm" title={percentage.toFixed(1) + "% of " + this.state.total_queries.toLocaleString()}>
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