/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Domains component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { api, ignoreCancel, makeCancelable } from '../utils';

class TopDomains extends Component {
  state = {
    total_queries: 0,
    top_domains: {}
  };

  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    this.updateHandler = makeCancelable(api.getTopDomains(), { repeat: this.updateChart, interval: 10 * 1000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        total_queries: res.total_queries,
        top_domains: res.top_domains
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
    const { t } = this.props;

    return (
      <div className="col-md-6 col-xl-4">
        <div className="card">
          <div className="card-header">
            {t("Top Permitted Domains")}
          </div>
          <div className="card-block">
            <div style={{overflowX: "auto"}}>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>{t("Domain")}</th>
                    <th>{t("Hits")}</th>
                    <th>{t("Frequency")}</th>
                  </tr>
                  {
                    Object.keys(this.state.top_domains).map(item => {
                      const stat = this.state.top_domains[item];
                      const percentage = stat / this.state.total_queries * 100;
                      return (
                        <tr key={item}>
                          <td>
                            {item}
                          </td>
                          <td>
                            {stat.toLocaleString()}
                          </td>
                          <td>
                            <div className="progress progress-sm"
                                 title={
                                   t("{{percent}}% of {{total}}", {
                                     percent: percentage.toFixed(1),
                                     total: this.state.total_queries.toLocaleString()
                                   })
                                 }>
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

export default translate(["common", "dashboard"])(TopDomains);
