/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Clients component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { api, ignoreCancel, makeCancelable } from '../utils';

export default class TopClients extends Component {
  state = {
    total_queries: 0,
    top_clients: {}
  };

  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    this.updateHandler = makeCancelable(api.getTopClients(), { repeat: this.updateChart, interval: 10 * 1000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        total_queries: res.dns_queries_today,
        top_clients: res.top_clients
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
            Top Clients
          </div>
          <div className="card-block">
            <div style={{overflowX: "auto"}}>
              <table className="table table-bordered">
                <tbody>
                <tr>
                  <th>Client</th>
                  <th>Requests</th>
                  <th>Frequency</th>
                </tr>
                {
                  Object.keys(this.state.top_clients).map((item) => {
                    let hostname = "";
                    let ipAddr = "";
                    const stat = this.state.top_clients[item];
                    const percentage = stat / this.state.total_queries * 100;

                    // Check if we have the IP and hostname
                    // ex. localhost|127.0.0.1
                    const parts = item.split("|");
                    if(item.includes("|")) {
                      hostname = parts[0];
                      ipAddr = parts[1];
                    }
                    else
                      ipAddr = parts[0];

                    return (
                      <tr key={item}>
                        <td>
                          {hostname !== "" ? hostname : ipAddr}
                        </td>
                        <td>
                          {stat.toLocaleString()}
                        </td>
                        <td>
                          <div className="progress progress-sm" title={percentage.toFixed(1) + "% of " + this.state.total_queries.toLocaleString()}>
                            <div className="progress-bar bg-primary" style={{width: percentage + "%"}}/>
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
