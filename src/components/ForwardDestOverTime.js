/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Forward Destinations Over Time component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { padNumber, api, makeCancelable, ignoreCancel } from '../utils';

export default class ForwardDestOverTime extends Component {
  state = {
    loading: true,
    data: {
      labels: [],
      datasets: []
    },
    options: {
      tooltips: {
        enabled: true,
        mode: "x-axis",
        callbacks: {
          title: tooltipItem => {
            const label = tooltipItem[0].xLabel;
            const time = label.match(/(\d?\d):?(\d?\d?)/);
            const h = parseInt(time[1], 10);
            const m = parseInt(time[2], 10) || 0;
            const from = padNumber(h)+":"+padNumber(m-5)+":00";
            const to = padNumber(h)+":"+padNumber(m+4)+":59";
            return "Forward destinations from "+from+" to "+to;
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
      api.getForwardDestOverTime(),
      { repeat: this.updateGraph, interval: 10 * 60 * 1000 }
    );
    this.updateHandler.promise.then(res => {
      // Remove last data point as it's not yet finished
      res.over_time.splice(-1, 1);

      const labels = [];
      const destinations = res.forward_destinations;
      const datasets = [];
      const colors = [
        "#20a8d8",
        "#f86c6b",
        "#4dbd74",
        "#f8cb00",
        "#263238",
        "#63c2de",
        "#b0bec5"
      ];

      // Fill in destination information
      let i = 0;
      for(let destination of destinations) {
        datasets.push({
          label: destination.split("|")[0],
          // If we ran out of colors, make a random one
          backgroundColor: i < colors.length
            ? colors[i]
            : '#' + parseInt("" + Math.random() * 0xffffff, 10).toString(16),
          pointRadius: 0,
          pointHitRadius: 5,
          pointHoverRadius: 5,
          data: []
        });

        i++;
      }

      // Fill in data & labels
      for(let step of res.over_time) {
        const date = new Date(1000 * step.timestamp);
        const sum = step.data.reduce((a, b) => a + b);

        if (sum > 0) {
          for(let destination in datasets) {
            if(datasets.hasOwnProperty(destination))
              datasets[destination].data.push(step.data[destination] / sum);
          }
        }

        labels.push(date);
      }

      const data = this.state.data;
      data.labels = labels;
      data.datasets = datasets;

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
            Forward Destinations Over Time
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
