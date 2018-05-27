/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Blocked component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { api, ignoreCancel, makeCancelable } from '../utils';

export default class TopBlocked extends Component {
  state = {
    total_blocked: 0,
    top_blocked: []
  };

  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    this.updateHandler = makeCancelable(api.getTopBlocked(), { repeat: this.updateChart, interval: 10 * 1000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        total_blocked: res.blocked_queries,
        top_blocked: res.top_blocked
      });
    }).catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="col-md-6 col-xl-4">
        <div className="card">
          <div className="card-header">
            Top Blocked Domains
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
                  this.state.top_blocked.map(item => {
                    const percentage = item.count / this.state.total_blocked * 100;
                    return (
                      <tr key={item.domain}>
                        <td>
                          {item.domain}
                        </td>
                        <td>
                          {item.count.toLocaleString()}
                        </td>
                        <td>
                          <div className="progress progress-sm" title={percentage.toFixed(1) + "% of " + this.state.total_blocked.toLocaleString()}>
                            <div className="progress-bar bg-warning" style={{width: percentage + "%"}}/>
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
            this.state.total_blocked === 0
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
