/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Clients Graph component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import { padNumber, api, makeCancelable, ignoreCancel } from '../utils';
import ChartTooltip from "./ChartTooltip";

class ClientsGraph extends Component {
  state = {
    loading: true,
    data: {
      labels: [],
      datasets: []
    }
  };

  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    this.updateHandler = makeCancelable(api.getClientsGraph(), { repeat: this.updateGraph, interval: 10 * 60 * 1000 });
    this.updateHandler.promise.then(res => {
      // Remove last data point as it's not yet finished
      res.over_time.splice(-1, 1);

      const colors = [
        "#20a8d8",
        "#f86c6b",
        "#4dbd74",
        "#f8cb00",
        "#263238",
        "#63c2de",
        "#b0bec5"
      ];
      const labels = res.over_time.map(step => new Date(1000 * step.timestamp));
      const datasets = [];

      // Fill in dataset metadata
      let i = 0;
      for(let client of res.clients) {
        datasets.push({
          label: client.name.length !== 0 ? client.name : client.ip,
          // If we ran out of colors, make a random one
          backgroundColor: i < colors.length
            ? colors[i]
            : '#' + parseInt("" + Math.random() * 0xffffff, 10).toString(16),
          pointRadius: 0,
          pointHitRadius: 5,
          pointHoverRadius: 5,
          cubicInterpolationMode: "monotone",
          data: []
        });

        i++;
      }

      // Fill in data & labels
      for(let step of res.over_time) {
        for(let destination in datasets) {
          if(datasets.hasOwnProperty(destination))
            datasets[destination].data.push(step.data[destination]);
        }
      }

      datasets.sort((a, b) => a.label.localeCompare(b.label));

      this.setState({ data: { labels, datasets }, loading: false });
    }).catch(ignoreCancel)
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    const options = {
      tooltips: {
        enabled: false,
        mode: "x-axis",
        custom: () => "placeholder",
        itemSort: function(a, b) {
          return b.yLabel - a.yLabel;
        },
        callbacks: {
          title: tooltipItem => {
            const time = tooltipItem[0].xLabel.match(/(\d?\d):?(\d?\d?)/);
            const hour = parseInt(time[1], 10);
            const minute = parseInt(time[2], 10) || 0;
            const from = padNumber(hour) + ":" + padNumber(minute - 5) + ":00";
            const to = padNumber(hour) + ":" + padNumber(minute + 4) + ":59";

            return t("Client activity from {{from}} to {{to}}", { from, to });
          },
          label: (tooltipItems, data) => {
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
          ticks: { beginAtZero: true },
          stacked: true
        }]
      },
      maintainAspectRatio: false
    };

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              {t("Clients Over Last 24 Hours")}
            </div>
            <div className="card-block">
              <Line width={970} height={170} data={this.state.data} options={options} ref={this.graphRef}/>
            </div>
            {
              this.state.loading
                ?
                <div className="card-img-overlay" style={{ background: "rgba(255,255,255,0.7)" }}>
                  <i className="fa fa-refresh fa-spin"
                     style={{ position: "absolute", top: "50%", left: "50%", fontSize: "30px" }}/>
                </div>
                :
                null
            }
          </div>
        </div>
        {
          // Now you're thinking with portals!
          ReactDOM.createPortal(
            <ChartTooltip chart={this.graphRef} handler={options.tooltips}/>,
            document.body
          )
        }
      </div>
    );
  }
}

export default translate("dashboard")(ClientsGraph);