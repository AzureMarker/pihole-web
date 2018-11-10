/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Generic Doughnut Chart component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";
import { WithAPIData } from "../common/WithAPIData";

export class GenericDoughnutChart extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  handleClick = (e, index) => {
    // Hide the entry by clicking on the internal legend item
    const chart = this.chartRef.current.chartInstance;
    chart.legend.options.onClick.call(
      chart,
      e,
      chart.legend.legendItems[index]
    );

    // Cause an update so the external legend gets updated
    this.forceUpdate();
  };

  render() {
    const options = {
      legend: { display: false },
      tooltips: {
        enabled: true,
        callbacks: {
          title: () => this.props.title,
          label: (tooltipItems, data) => {
            const dataset = data.datasets[tooltipItems.datasetIndex];
            const label = data.labels[tooltipItems.index];
            return (
              label + ": " + dataset.data[tooltipItems.index].toFixed(1) + "%"
            );
          }
        }
      },
      maintainAspectRatio: false
    };

    // Get the metadata for the items, so we know if they are hidden or not.
    // If the chart has not been created yet, make some fake metadata.
    const meta =
      this.chartRef.current !== null
        ? this.chartRef.current.chartInstance.getDatasetMeta(0).data
        : this.props.data.map(() => ({ hidden: false }));

    return (
      <div className="card">
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">
          <div className="float-left" style={{ width: "67%" }}>
            <Doughnut
              width={100}
              height={250}
              options={options}
              ref={this.chartRef}
              data={{
                datasets: [
                  {
                    data: this.props.data,
                    backgroundColor: this.props.colors
                  }
                ],
                labels: this.props.labels
              }}
            />
          </div>
          <div className="float-right" style={{ width: "33%" }}>
            <ul className="chart-legend">
              {this.props.labels
                // Zip label and color together
                .map((label, i) => [label, this.props.colors[i]])
                // Create the list items
                .map(([label, color], i) => (
                  <li
                    key={i}
                    className={meta[i] && meta[i].hidden ? "strike" : ""}
                    onClick={e => this.handleClick(e, i)}
                  >
                    <span style={{ backgroundColor: color }} />
                    {label}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {this.props.loading ? (
          <div
            className="card-img-overlay"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            <i
              className="fa fa-refresh fa-spin"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                fontSize: "30px"
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

/**
 * Transform the API data into props for GenericDoughnutChart
 *
 * @param apiData the API data
 * @returns {{loading: boolean, data: Array, colors: Array, labels: Array}}
 * GenericDoughnutChart props
 */
export const transformData = apiData => {
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
  for (let entry of apiData) {
    data.push(entry.percent);
    labels.push(entry.name.length !== 0 ? entry.name : entry.ip);
    usedColors.push(
      // If we ran out of colors, make a random one
      i < colors.length
        ? colors[i]
        : "#" +
          parseInt("" + Math.random() * 0xffffff, 10)
            .toString(16)
            .padStart(6, "0")
    );

    i++;
  }

  return {
    loading: false,
    data,
    colors: usedColors,
    labels
  };
};

/**
 * The props used to show a loading state (either initial load or error)
 *
 * @returns {*} the loading props
 */
export const loadingProps = () => ({
  loading: true,
  data: [],
  colors: [],
  labels: []
});

export default ({ apiCall, title, ...props }) => (
  <WithAPIData
    apiCall={apiCall}
    renderInitial={() => (
      <GenericDoughnutChart title={title} {...loadingProps()} {...props} />
    )}
    renderOk={data => (
      <GenericDoughnutChart title={title} {...transformData(data)} {...props} />
    )}
    renderErr={() => (
      <GenericDoughnutChart title={title} {...loadingProps()} {...props} />
    )}
  />
);
