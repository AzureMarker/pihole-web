/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Query Types Over Time component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { padNumber, api, makeCancelable, ignoreCancel } from '../utils';

export default class QueryTypesOverTime extends Component {
  state = {
    loading: true,
    data: {
      labels: [],
      datasets: [
        {
          label: "A: IPv4 queries",
          pointRadius: 0,
          pointHitRadius: 5,
          pointHoverRadius: 5,
          backgroundColor: "#20a8d8",
          data: []
        },
        {
          label: "AAAA: IPv6 queries",
          pointRadius: 0,
          pointHitRadius: 5,
          pointHoverRadius: 5,
          backgroundColor: "#f86c6b",
          data: []
        }
      ]
    },
    options: {
      tooltips: {
        enabled: true,
        mode: "x-axis",
        callbacks: {
          title: (tooltipItem, data) => {
            const label = tooltipItem[0].xLabel;
            const time = label.match(/(\d?\d):?(\d?\d?)/);
            const h = parseInt(time[1], 10);
            const m = parseInt(time[2], 10) || 0;
            const from = padNumber(h)+":"+padNumber(m-5)+":00";
            const to = padNumber(h)+":"+padNumber(m+4)+":59";
            return "Query types from "+from+" to "+to;
          },
          label: (tooltipItems, data) => {
            return data.datasets[tooltipItems.datasetIndex].label + ": " + (100.0*tooltipItems.yLabel).toFixed(1) + "%";
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
            mix: 0.0,
            max: 1.0,
            beginAtZero: true,
            callback: (value, index, values) => Math.round(value*100) + "%"
          },
          stacked: true
        }]
      },
      maintainAspectRatio: true
    }
  };

  constructor(props) {
    super(props);
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    this.updateHandler = makeCancelable(
      api.getQueryTypesOverTime(),
      { repeat: this.updateGraph, interval: 10 * 60 * 1000 }
    );
    this.updateHandler.promise.then(res => {
      // Remove last data point as it's not yet finished
      res.splice(-1, 1);

      const labels = [];
      const data_A = [];
      const data_AAAA = [];

      for(let step of res) {
        const date = new Date(1000 * step.timestamp);

        const sum = step.data.reduce((a, b) => a + b);
        let A = 0, AAAA = 0;

        if (sum > 0) {
          A = step.data[0] / sum;
          AAAA = step.data[1] / sum;
        }

        labels.push(date);
        data_A.push(A);
        data_AAAA.push(AAAA);
      }

      const data = this.state.data;
      data.labels = labels;
      data.datasets[0].data = data_A;
      data.datasets[1].data = data_AAAA;

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
      <div className="col-md-12 col-lg-6">
        <div className="card">
          <div className="card-header">
            Query Types Over Time
          </div>
          <div className="card-block">
            <Line width={400} height={150} data={this.state.data} options={this.state.options}/>
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
    );
  }
}
