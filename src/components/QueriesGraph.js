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
import { padNumber, api, makeCancelable, ignoreCancel } from '../utils';

export default class QueriesGraph extends Component {
  state = {
    loading: true,
    data: {
      labels: [],
      datasets: [
        {
          label: "Total Queries",
          data: [],
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
          label: "Blocked Queries",
          data: [],
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
    },
    options: {
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

            return "Queries from " + from + " to " + to;
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
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: "hour",
            displayFormats: {
              hour: "HH:mm"
            },
            tooltipFormat: "HH:mm"
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false
    }
  };

  constructor(props) {
    super(props);
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    this.updateHandler = makeCancelable(api.getHistoryGraph(), { repeat: this.updateGraph, interval: 10 * 60 * 1000});
    this.updateHandler.promise.then(res => {
      // Remove last data point as it's not yet finished
      res.blocked_over_time.splice(-1, 1);
      res.domains_over_time.splice(-1, 1);

      const data = this.state.data;
      data.labels = res.domains_over_time.map(step => new Date(1000 * step.timestamp));
      data.datasets[0].data = res.domains_over_time.map(step => step.count);
      data.datasets[1].data = res.blocked_over_time.map(step => step.count);

      this.setState({ data, loading: false });
    }).catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              Queries Over Last 24 Hours
            </div>
            <div className="card-block">
              <Line width={970} height={250} data={this.state.data} options={this.state.options}/>
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
