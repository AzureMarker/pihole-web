/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Clients Graph component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component, RefObject } from "react";
import ReactDOM from "react-dom";
import { Line } from "react-chartjs-2";
import { WithTranslation, withTranslation } from "react-i18next";
import { getIntervalForRange, padNumber } from "../../util/graphUtils";
import api from "../../util/api";
import ChartTooltip from "./ChartTooltip";
import { WithAPIData } from "../common/WithAPIData";
import { ChartDataSets, ChartOptions, TimeUnit } from "chart.js";
import {
  TimeRange,
  TimeRangeContext
} from "../common/context/TimeRangeContext";

export interface ClientsGraphProps {
  loading: boolean;
  labels: Array<string>;
  timeUnit: TimeUnit;
  rangeName?: string;
  datasets: Array<ChartDataSets>;
}

class ClientsGraph extends Component<ClientsGraphProps & WithTranslation, {}> {
  private readonly graphRef: RefObject<Line>;

  constructor(props: ClientsGraphProps & WithTranslation) {
    super(props);
    this.graphRef = React.createRef();
  }

  render() {
    const { t } = this.props;

    const options: ChartOptions = {
      tooltips: {
        enabled: false,
        mode: "x-axis",
        custom: () => "placeholder",
        itemSort: (a, b) => {
          // @ts-ignore
          return b.yLabel - a.yLabel;
        },
        callbacks: {
          title: tooltipItem => {
            const timeStr = tooltipItem[0].xLabel! as string;
            const time = timeStr.match(/(\d?\d):?(\d?\d?)/);
            const hour = parseInt(time![1], 10);
            const minute = parseInt(time![2], 10) || 0;
            const from = padNumber(hour) + ":" + padNumber(minute - 5) + ":00";
            const to = padNumber(hour) + ":" + padNumber(minute + 4) + ":59";

            return t("Client activity from {{from}} to {{to}}", { from, to });
          },
          label: (tooltipItems, data) => {
            return (
              data.datasets![tooltipItems.datasetIndex!].label +
              ": " +
              tooltipItems.yLabel
            );
          }
        }
      },
      legend: { display: false },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: this.props.timeUnit,
              displayFormats: { hour: "HH:mm" },
              tooltipFormat: "HH:mm"
            }
          }
        ],
        yAxes: [
          {
            ticks: { beginAtZero: true },
            stacked: true
          }
        ]
      },
      maintainAspectRatio: false
    };

    const range = this.props.rangeName
      ? this.props.rangeName
      : t("Last 24 Hours");

    return (
      <div className="card">
        <div className="card-header">
          {t("Clients Over {{range}}", { range })}
        </div>
        <div className="card-body">
          <Line
            width={970}
            height={170}
            data={{
              labels: this.props.labels,
              datasets: this.props.datasets
            }}
            options={options}
            ref={this.graphRef}
          />
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

        {// Now you're thinking with portals!
        ReactDOM.createPortal(
          <ChartTooltip chart={this.graphRef} handler={options.tooltips!} />,
          document.body
        )}
      </div>
    );
  }
}

/**
 * Transform the API data into props for ClientsGraph
 *
 * @param data The API data
 * @param range The time range to use
 * @returns {{labels: Date[], datasets: Array, loading: boolean}} ClientsGraph
 * props
 */
export const transformData = (
  data: ApiClientsGraph,
  range: TimeRange | null
) => {
  let timeUnit: TimeUnit = "hour";
  let overTime = data.over_time;

  if (range) {
    if (range.until.diff(range.from, "day") > 1) {
      timeUnit = "day";
    }
  } else {
    // Remove last data point as it's not yet finished
    overTime = data.over_time.slice(0, -1);
  }

  const colors = [
    "#20a8d8",
    "#f86c6b",
    "#4dbd74",
    "#f8cb00",
    "#263238",
    "#63c2de",
    "#b0bec5"
  ];
  const labels = overTime.map(step => new Date(1000 * step.timestamp));
  const datasets: Array<ChartDataSets> = [];

  // Fill in dataset metadata
  let i = 0;
  for (let client of data.clients) {
    datasets.push({
      label: client.name.length !== 0 ? client.name : client.ip,
      // If we ran out of colors, make a random one
      backgroundColor:
        i < colors.length
          ? colors[i]
          : "#" +
            parseInt("" + Math.random() * 0xffffff, 10)
              .toString(16)
              .padStart(6, "0"),
      pointRadius: 0,
      pointHitRadius: 5,
      pointHoverRadius: 5,
      cubicInterpolationMode: "monotone",
      data: []
    });

    i++;
  }

  // Fill in data & labels
  for (let step of overTime) {
    for (let destination in datasets) {
      if (datasets.hasOwnProperty(destination))
        (datasets[destination].data as Array<number>).push(
          step.data[destination]
        );
    }
  }

  datasets.sort((a, b) => a.label!.localeCompare(b.label!));

  return {
    labels,
    datasets,
    loading: false,
    timeUnit,
    rangeName: range ? range.name : undefined
  };
};

/**
 * The props used to show a loading state (either initial load or error)
 */
export const loadingProps: ClientsGraphProps = {
  loading: true,
  labels: [],
  timeUnit: "hour",
  rangeName: "---",
  datasets: []
};

export const TranslatedClientsGraph = withTranslation([
  "dashboard",
  "time-ranges"
])(ClientsGraph);

export default (props: any) => (
  <TimeRangeContext.Consumer>
    {context => (
      <WithAPIData
        apiCall={() =>
          context.range
            ? api.getClientsGraphDb(
                context.range,
                getIntervalForRange(context.range)
              )
            : api.getClientsGraph()
        }
        repeatOptions={
          context.range
            ? undefined
            : {
                interval: 10 * 60 * 1000,
                ignoreCancel: true
              }
        }
        renderInitial={() => (
          <TranslatedClientsGraph {...loadingProps} {...props} />
        )}
        renderOk={data => (
          <TranslatedClientsGraph
            {...transformData(data, context.range)}
            {...props}
          />
        )}
        renderErr={() => (
          <TranslatedClientsGraph {...loadingProps} {...props} />
        )}
      />
    )}
  </TimeRangeContext.Consumer>
);
