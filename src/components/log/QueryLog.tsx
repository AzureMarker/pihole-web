/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Query Log component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from "react";
import ReactTable, {
  Filter,
  ReactTableFunction,
  RowInfo,
  RowRenderProps
} from "react-table";
import i18n, { TFunction } from "i18next";
import { WithTranslation, withTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import moment from "moment";
import { padNumber } from "../../util/graphUtils";
import api from "../../util/api";
import { dateRanges } from "../../util/dateRanges";
import { TranslatedTimeRangeSelector } from "../dashboard/TimeRangeSelector";
import { TimeRange } from "../common/context/TimeRangeContext";
import "react-table/react-table.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";

export interface QueryLogState {
  history: ApiQuery[];
  cursor: null | string;
  loading: boolean;
  atEnd: boolean;
  filtersChanged: boolean;
  filters: Filter[];
}

/**
 * Get the default time range for the query log
 *
 * @param t The translation function
 */
const getDefaultRange = (t: TFunction): TimeRange => {
  const translatedDateRanges = dateRanges(t);
  const last24Hours = t("Last 24 Hours");

  return {
    from: translatedDateRanges[last24Hours][0],
    until: translatedDateRanges[last24Hours][1],
    name: last24Hours
  };
};

class QueryLog extends Component<WithTranslation, QueryLogState> {
  private updateHandler: null | CancelablePromise<ApiHistoryResponse> = null;

  state: QueryLogState = {
    history: [],
    cursor: null,
    loading: false,
    atEnd: false,
    filtersChanged: false,
    filters: []
  };

  constructor(props: WithTranslation) {
    super(props);

    const { t } = this.props;

    // This happens in the constructor to more easily use the translated date
    // ranges
    this.state.filters = [
      {
        id: "time",
        value: getDefaultRange(t)
      }
    ];
  }

  componentWillUnmount() {
    if (this.updateHandler) {
      this.updateHandler.cancel();
    }
  }

  /**
   * Get the props for a given row
   *
   * @param state the state of the ReactTable
   * @param rowInfo the row information
   * @returns {*} props for the row
   */
  getRowProps = (state: any, rowInfo: RowInfo | undefined) => {
    // Check if the row is known to be blocked or allowed (not unknown)
    if (rowInfo && rowInfo.row.status !== 0) {
      // Blocked queries are red, allowed queries are green
      return {
        style: {
          color: [1, 4, 5, 6].includes(rowInfo.row.status) ? "red" : "green"
        }
      };
    }

    // Unknown queries do not get colored
    return {};
  };

  /**
   * Convert the table filters into API history filters
   *
   * @param tableFilters the filters requested by the table
   * @return the filters converted for use by the API
   */
  parseFilters = (tableFilters: Filter[]) => {
    const filters: any = {};

    for (const filter of tableFilters) {
      switch (filter.id) {
        case "time":
          filters.from = moment(filter.value.from).unix();
          filters.until = moment(filter.value.until).unix();
          break;
        case "queryType":
          if (filter.value === "all") {
            // Filter is not applied
            break;
          }

          filters.query_type = parseInt(filter.value);
          break;
        case "domain":
          if (filter.value.length === 0) {
            // Filter is not applied
            break;
          }

          filters.domain = filter.value;
          break;
        case "client":
          if (filter.value.length === 0) {
            // Filter is not applied
            break;
          }

          filters.client = filter.value;
          break;
        case "status":
          switch (filter.value) {
            case "all":
              // Filter is not applied
              break;
            case "allowed":
              filters.blocked = false;
              break;
            case "blocked":
              filters.blocked = true;
              break;
            default:
              filters.status = filter.value;
              break;
          }
          break;
        case "dnssec":
          if (filter.value === "all") {
            // Filter is not applied
            break;
          }

          filters.dnssec = filter.value;
          break;
        case "reply":
          if (filter.value === "all") {
            // Filter is not applied
            break;
          }

          filters.reply = filter.value;
          break;
        default:
          break;
      }
    }

    return filters;
  };

  /**
   * Fetch queries from the API, if necessary. This is called from the
   * ReactTable component, which dictates its parameters.
   *
   * @param page The page of the query log
   * @param pageSize The number of queries in the page
   */
  fetchQueries = ({ page, pageSize }: { page: number; pageSize: number }) => {
    // Don't fetch the queries if:
    // - We've reached the end of the queries
    // - We are still waiting for the last fetch to finish
    // - Filters are the same and we already have this page and the next
    if (
      this.state.atEnd ||
      this.state.loading ||
      (!this.state.filtersChanged &&
        this.state.history.length >= (page + 2) * pageSize)
    ) {
      return;
    }

    // We have to ask the API for more queries
    this.setState({ loading: true });

    // Send a request for more queries
    this.updateHandler = makeCancelable(
      api.getHistory({
        cursor: this.state.cursor,
        ...this.parseFilters(this.state.filters)
      })
    );

    this.updateHandler.promise
      .then(data => {
        // Update the log with the new queries
        this.setState(prevState => ({
          loading: false,
          atEnd: data.cursor === null,
          cursor: data.cursor,
          history: prevState.history.concat(data.history),
          filtersChanged: false
        }));
      })
      .catch(ignoreCancel);
  };

  render() {
    const { t } = this.props;

    return (
      <ReactTable
        className="-striped bg-white mb-4"
        style={{ lineHeight: 1 }}
        columns={columns(t)}
        showPaginationTop
        sortable={false}
        filterable={false}
        data={this.state.history}
        loading={this.state.loading}
        onFetchData={state => {
          if (isEqual(state.filtered, this.state.filters)) {
            // If the filters have not changed, do not debounce the fetch.
            // This allows fetching the next page to happen without waiting for
            // the debounce.
            this.fetchQueries(state);
          } else {
            // The filters have changed, so debounce until they have stabilized
            // (wait for the user to stop typing)
            return debounce(this.fetchQueries, 350)(state);
          }
        }}
        onFilteredChange={debounce(filters => {
          if (isEqual(filters, this.state.filters)) {
            return;
          }

          this.setState({
            filters,
            filtersChanged: true,
            cursor: null,
            atEnd: false,
            loading: false,
            history: []
          });
        }, 300)}
        defaultFiltered={[
          {
            id: "time",
            value: getDefaultRange(t)
          }
        ]}
        getTrProps={this.getRowProps}
        ofText={this.state.atEnd ? "of" : "of at least"}
        // Pad empty rows to have the same height as filled rows
        PadRowComponent={() => (
          <span>
            &nbsp;
            <br />
            &nbsp;
          </span>
        )}
      />
    );
  }
}

/**
 * Convert a status code to a status message. The messages are translated, so
 * you must pass in the translation function before using the message array.
 */
const status = (t: TFunction) => [
  t("Unknown"),
  t("Blocked (gravity)"),
  t("Allowed (forwarded)"),
  t("Allowed (cached)"),
  t("Blocked (regex/wildcard)"),
  t("Blocked (blacklist)"),
  t("Blocked (external)")
];

/**
 * Convert a DNSSEC code to a DNSSEC message. The messages are translated, so
 * you must pass in the translation function before using the message array.
 */
const dnssec = (t: TFunction) => [
  "N/A", // Unspecified, which means DNSSEC is off, so nothing should be shown
  t("Secure"),
  t("Insecure"),
  t("Bogus"),
  t("Abandoned"),
  t("Unknown")
];

const dnssecColor = [
  "", // Unspecified, which means DNSSEC is off, so the initial color should be shown
  "green", // Secure
  "orange", // Insecure
  "red", // Bogus
  "red", // Abandoned
  "orange" // Unknown
];

/**
 * Convert a reply type code to a reply type. The unknown type is translated, so
 * you must pass in the translation function before using the message array.
 */
const replyTypes = (t: TFunction) => [
  t("Unknown"),
  "NODATA",
  "NXDOMAIN",
  "CNAME",
  "IP",
  "DOMAIN",
  "RRNAME"
];

/**
 * Convert a query type code to a query type.
 */
const queryTypes = ["A", "AAAA", "ANY", "SRV", "SOA", "PTR", "TXT"];

/**
 * Create a method which returns a select component for the filter, using the
 * supplied items as the selectable filters.
 *
 * @param items The options to show in the filter
 * @param t The translation function
 * @param extras Extra custom options which should show up in the filter list
 * @returns {function({filter: *, onChange: *}): *} A select component with the
 * filter data
 */
const selectionFilter = (
  items: string[],
  t: TFunction,
  extras: { name: string; value: any }[] = []
) => {
  return ({
    filter,
    onChange
  }: {
    filter: Filter;
    onChange: ReactTableFunction;
  }) => (
    <select
      onChange={event => onChange(event.target.value)}
      style={{ width: "100%" }}
      value={filter ? filter.value : "all"}
    >
      <option value="all">{t("All")}</option>
      {extras.map((extra, i) => (
        <option key={i} value={extra.value}>
          {extra.name}
        </option>
      ))}
      {items.map((item, i) => (
        <option key={i + extras.length} value={i}>
          {item}
        </option>
      ))}
    </select>
  );
};

/**
 * The columns of the Query Log. Some pieces are translated, so you must pass in
 * the translation function before using the columns.
 */
const columns = (t: TFunction) => [
  {
    Header: t("Time"),
    id: "time",
    accessor: (r: ApiQuery) => r.timestamp,
    width: 70,
    Cell: (row: RowRenderProps) => {
      const date = new Date(row.value * 1000);
      const month = date.toLocaleDateString(i18n.language, {
        month: "short"
      });
      const dayOfMonth = padNumber(date.getDate());
      const hour = padNumber(date.getHours());
      const minute = padNumber(date.getMinutes());
      const second = padNumber(date.getSeconds());

      return (
        <Fragment>
          {month + ", " + dayOfMonth}
          <br />
          {hour + ":" + minute + ":" + second}
        </Fragment>
      );
    },
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: ({
      filter,
      onChange
    }: {
      filter: Filter;
      onChange: ReactTableFunction;
    }) => (
      <TranslatedTimeRangeSelector
        range={filter ? filter.value : null}
        onSelect={range => {
          if (range) {
            onChange(range);
          } else {
            onChange(getDefaultRange(t));
          }
        }}
        showLabel={false}
      />
    )
  },
  {
    Header: t("Type"),
    id: "queryType",
    accessor: (r: ApiQuery) => queryTypes[r.type],
    width: 50,
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: selectionFilter(queryTypes, t)
  },
  {
    Header: t("Domain"),
    id: "domain",
    accessor: (r: ApiQuery) => r.domain,
    minWidth: 150,
    className: "horizontal-scroll",
    filterable: true,
    filterMethod: () => true // Don't filter client side
  },
  {
    Header: t("Client"),
    id: "client",
    accessor: (r: ApiQuery) => r.client,
    minWidth: 120,
    className: "horizontal-scroll",
    filterable: true,
    filterMethod: () => true // Don't filter client side
  },
  {
    Header: t("Status"),
    id: "status",
    accessor: (r: ApiQuery) => r.status,
    width: 140,
    Cell: (row: RowRenderProps) => status(t)[row.value],
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: selectionFilter(status(t), t, [
      { name: t("Allowed"), value: "allowed" },
      { name: t("Blocked"), value: "blocked" }
    ])
  },
  {
    Header: "DNSSEC",
    id: "dnssec",
    accessor: (r: ApiQuery) => r.dnssec,
    width: 90,
    Cell: (row: RowRenderProps) => (
      <div style={{ color: dnssecColor[row.value] }}>
        {dnssec(t)[row.value]}
      </div>
    ),
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: selectionFilter(dnssec(t), t)
  },
  {
    Header: t("Reply"),
    id: "reply",
    accessor: (r: ApiQuery) => ({ type: r.reply, time: r.response_time }),
    width: 90,
    Cell: (row: RowRenderProps) => (
      <div style={{ color: "black" }}>
        {replyTypes(t)[row.value.type]}
        <br />
        {"(" + (row.value.time / 10).toLocaleString() + "ms)"}
      </div>
    ),
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: selectionFilter(replyTypes(t), t)
  },
  {
    Header: t("Action"),
    width: 100,
    filterable: false,
    Cell: (data: { row: any }) => {
      // Blocked, but can whitelist
      if ([1, 4, 5].includes(data.row.status)) {
        return (
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={() => api.addExactWhitelist(data.row.domain)}
          >
            {t("Whitelist")}
          </button>
        );
      }

      // Not explicitly blocked (or is whitelisted), but could be blocked.
      // This includes externally blocked.
      if ([2, 3, 6].includes(data.row.status)) {
        return (
          <button
            type="button"
            className="btn btn-danger btn-block"
            onClick={() => api.addExactBlacklist(data.row.domain)}
          >
            {t("Blacklist")}
          </button>
        );
      }

      return null;
    }
  }
];

export default withTranslation(["common", "query-log", "time-ranges"])(
  QueryLog
);
