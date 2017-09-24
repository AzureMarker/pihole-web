/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Query Types Over Time component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { padNumber, parseObjectForGraph, api, makeCancelable, ignoreCancel } from '../utils';

export default class QueryTypesOverTime extends Component {
  state = {
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
      res.query_types = parseObjectForGraph(res.query_types);

      // Remove last data point as it's not yet finished
      res.query_types[0].splice(-1, 1);

      const labels = [];
      const data_A = [];
      const data_AAAA = [];
      const timestamps = res.query_types[0];
      const plotdata = res.query_types[1];

      for(let j in timestamps) {
        if(timestamps.hasOwnProperty(j)) {
          const h = parseInt(timestamps[j], 10);
          const d = new Date(1000 * h);

          const sum = plotdata[j][0] + plotdata[j][1];
          let A = 0, AAAA = 0;

          if (sum > 0) {
            A = plotdata[j][0] / sum;
            AAAA = plotdata[j][1] / sum;
          }

          labels.push(d);
          data_A.push(A);
          data_AAAA.push(AAAA);
        }
      }

      const data = this.state.data;
      data.labels = labels;
      data.datasets[0].data = data_A;
      data.datasets[1].data = data_AAAA;

      this.setState({ data });
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
            this.state.data.datasets[0].data.length === 0 && this.state.data.datasets[1].data.length === 0
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
