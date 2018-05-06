/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Queries Graph component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import { padNumber, parseObjectForGraph, api, makeCancelable, ignoreCancel } from '../utils';

class QueriesGraph extends Component {
  state = {
    loading: true,
    labels: [],
    domains_over_time: [],
    blocked_over_time: []
  };

  constructor(props) {
    super(props);
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    this.updateHandler = makeCancelable(api.getHistoryGraph(), { repeat: this.updateGraph, interval: 10 * 60 * 1000});
    this.updateHandler.promise.then(res => {
      res.blocked_over_time = parseObjectForGraph(res.blocked_over_time);
      res.domains_over_time = parseObjectForGraph(res.domains_over_time);

      // Remove last data point as it's not yet finished
      res.blocked_over_time[0].splice(-1, 1);
      res.blocked_over_time[1].splice(-1, 1);
      res.domains_over_time[0].splice(-1, 1);
      res.domains_over_time[1].splice(-1, 1);

      // Generate labels
      const labels = [];
      for(let i in res.blocked_over_time[0]) {
        if(res.blocked_over_time[0].hasOwnProperty(i))
          labels.push(new Date(1000 * res.blocked_over_time[0][i]));
      }

      this.setState({
        loading: false,
        labels: labels,
        domains_over_time: res.domains_over_time[1],
        blocked_over_time: res.blocked_over_time[1]
      });
    }).catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    const data = {
      labels: this.state.labels,
      datasets: [
        {
          label: t("Total Queries"),
          data: this.state.domains_over_time,
          fill: true,
          backgroundColor: "rgba(220,220,220,0.5)",
          borderColor: "rgba(0, 166, 90,.8)",
          pointBorderColor: "rgba(0, 166, 90,.8)",
          pointRadius: 1,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          cubicInterpolationMode: "monotone"
        },
        {
          label: t("Blocked Queries"),
          data: this.state.blocked_over_time,
          fill: true,
          backgroundColor: "rgba(0,192,239,0.5)",
          borderColor: "rgba(0,192,239,1)",
          pointBorderColor: "rgba(0,192,239,1)",
          pointRadius: 1,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          cubicInterpolationMode: "monotone"
        }
      ]
    };

    const options = {
      tooltips: {
        enabled: true,
        mode: "x-axis",
        callbacks: {
          title: tooltipItem => {
            const time = tooltipItem[0].xLabel.match(/(\d?\d):?(\d?\d?)/);
            const h = parseInt(time[1], 10);
            const m = parseInt(time[2], 10) || 0;
            const from = padNumber(h) + ":" + padNumber(m) + ":00";
            const to = padNumber(h) + ":" + padNumber(m + 9) + ":59";

            return t("Queries from {{from}} to {{to}}", { from, to });
          },
          label: (tooltipItems, data) => {
            if (tooltipItems.datasetIndex === 1) {
              let percentage = 0.0;
              const total = parseInt(data.datasets[0].data[tooltipItems.index], 10);
              const blocked = parseInt(data.datasets[1].data[tooltipItems.index], 10);

              if (total > 0)
                percentage = 100.0 * blocked / total;

              return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel
                + " (" + percentage.toFixed(1) + "%)";
            }
            else
              return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel;
          }
        }
      },
      legend: { display: false },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: "hour",
            displayFormats: { hour: "HH:mm" },
            tooltipFormat: "HH:mm"
          }
        }],
          yAxes: [{
          ticks: { beginAtZero: true }
        }]
      },
      maintainAspectRatio: false
    };

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              {t("Queries Over Last 24 Hours")}
            </div>
            <div className="card-block">
              <Line width={970} height={250} data={data} options={options}/>
            </div>
            {
              this.state.loading
              ?
                <div className="card-img-overlay" style={{background: "rgba(255,255,255,0.7)"}}>
                  <i className="fa fa-refresh fa-spin" style={{position: "absolute", top: "50%", left: "50%", fontSize: "30px"}}/>
                </div>
              :
                null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default translate(["common", "dashboard"])(QueriesGraph);
