/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Query Types Chart component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import { makeCancelable, api, ignoreCancel } from "../utils";

class QueryTypesChart extends Component {
  state = {
    loading: true,
    data: [],
    colors: [],
    labels: []
  };

  updateChart = () => {
    this.updateHandler = makeCancelable(api.getQueryTypes(), { repeat: this.updateChart, interval: 10 * 1000 });
    this.updateHandler.promise.then(queryTypes => {
      const colors = [
        "#20a8d8",
        "#f86c6b",
        "#4dbd74",
        "#f8cb00",
        "#263238",
        "#63c2de",
        "#b0bec5"
      ];
      const data = [];
      const labels = [];
      const usedColors = [];

      // Fill in dataset metadata
      let i = 0;
      for(let queryType of queryTypes) {
        data.push(queryType.percent);
        labels.push(queryType.name);
        usedColors.push(
          // If we ran out of colors, make a random one
          i < colors.length
            ? colors[i]
            : '#' + parseInt("" + Math.random() * 0xffffff, 10).toString(16)
        );

        i++;
      }

      this.setState({
        loading: false,
        data,
        colors: usedColors,
        labels
      })
    }).catch(ignoreCancel);
  };

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    const options = {
      legend: {
        display: true,
        position: "right"
      },
      tooltips: {
        enabled: true,
        callbacks: {
          title: () => t("Query Types"),
          label: (tooltipItems, data) => {
            const dataset = data.datasets[tooltipItems.datasetIndex];
            const label = data.labels[tooltipItems.index];
            return label + ": " + dataset.data[tooltipItems.index].toFixed(1) + "%";
          }
        }
      }
    };

    return (
      <div className="card">
        <div className="card-header">
          {t("Query Types")}
        </div>
        <div className="card-block">
          <Doughnut width={100} height={60} options={options}
                    data={{
                      datasets: [{
                        data: this.state.data,
                        backgroundColor: this.state.colors
                      }],
                      labels: this.state.labels
                    }}/>
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
    );
  }
}

export default translate("dashboard")(QueryTypesChart);
