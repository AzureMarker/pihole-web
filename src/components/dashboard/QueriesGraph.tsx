/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Queries Graph component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import { getIntervalForRange, padNumber } from "../../util";
import api from "../../util/api";
import { WithAPIData } from "../common/WithAPIData";
import { ChartData, ChartOptions, TimeUnit } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  TimeRange,
  TimeRangeContext
} from "../common/context/TimeRangeContext";

export interface QueriesGraphProps {
  loading: boolean;
  labels: Array<Date>;
  timeUnit: TimeUnit;
  rangeName?: string;
  domains_over_time: Array<number>;
  blocked_over_time: Array<number>;
}

class QueriesGraph extends Component<QueriesGraphProps & WithNamespaces, {}> {
  render() {
    const { t } = this.props;

    const data: ChartData = {
      // @ts-ignore
      labels: this.props.labels,
      datasets: [
        {
          label: t("Total Queries"),
          data: this.props.domains_over_time,
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
          data: this.props.blocked_over_time,
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

    const options: ChartOptions = {
      tooltips: {
        enabled: true,
        mode: "x-axis",
        callbacks: {
          title: tooltipItem => {
            const time = tooltipItem[0].xLabel!.match(/(\d?\d):?(\d?\d?)/);
            const hour = parseInt(time![1], 10);
            const minute = parseInt(time![2], 10) || 0;
            const from = padNumber(hour) + ":" + padNumber(minute - 5) + ":00";
            const to = padNumber(hour) + ":" + padNumber(minute + 4) + ":59";

            return t("Queries from {{from}} to {{to}}", { from, to });
          },
          label: (tooltipItems, data) => {
            if (tooltipItems.datasetIndex === 1) {
              let percentage = 0.0;
              const total = data.datasets![0].data![
                tooltipItems.index!
              ] as number;
              const blocked = data.datasets![1].data![
                tooltipItems.index!
              ] as number;

              if (total > 0) percentage = (100.0 * blocked) / total;

              return (
                data.datasets![tooltipItems.datasetIndex].label +
                ": " +
                tooltipItems.yLabel +
                " (" +
                percentage.toFixed(1) +
                "%)"
              );
            } else
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
            ticks: { beginAtZero: true }
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
          {t("Queries Over {{range}}", { range })}
        </div>
        <div className="card-body">
          <Line width={970} height={170} data={data} options={options} />
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
 * Transform the API data into props for QueriesGraph
 *
 * @param data The API data
 * @param range The time range to use
 * @returns QueriesGraphProps QueriesGraph props
 */
export const transformData = (
  data: Array<ApiHistoryGraphItem>,
  range: TimeRange | null
): QueriesGraphProps => {
  let timeUnit: TimeUnit = "hour";

  if (range) {
    if (range.until.diff(range.from, "day") > 1) {
      timeUnit = "day";
    }
  } else {
    // Remove last data point as it's not yet finished
    data = data.slice(0, -1);
  }

  const labels = data.map(step => new Date(1000 * step.timestamp));
  const domains_over_time = data.map(step => step.total_queries);
  const blocked_over_time = data.map(step => step.blocked_queries);

  return {
    loading: false,
    labels,
    timeUnit,
    rangeName: range ? range.name : undefined,
    domains_over_time,
    blocked_over_time
  };
};

/**
 * The props used to show a loading state (either initial load or error)
 */
export const loadingProps: QueriesGraphProps = {
  loading: true,
  labels: [],
  timeUnit: "hour",
  rangeName: "---",
  domains_over_time: [],
  blocked_over_time: []
};

export const TranslatedQueriesGraph = withNamespaces([
  "dashboard",
  "time-ranges"
])(QueriesGraph);

export default (props: any) => (
  <TimeRangeContext.Consumer>
    {context => (
      <WithAPIData
        apiCall={() =>
          context.range
            ? api.getHistoryGraphDb(
                context.range,
                getIntervalForRange(context.range)
              )
            : api.getHistoryGraph()
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
          <TranslatedQueriesGraph {...loadingProps} {...props} />
        )}
        renderOk={data => (
          <TranslatedQueriesGraph
            {...transformData(data, context.range)}
            {...props}
          />
        )}
        renderErr={() => (
          <TranslatedQueriesGraph {...loadingProps} {...props} />
        )}
      />
    )}
  </TimeRangeContext.Consumer>
);
