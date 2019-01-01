/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Query Log component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import i18n from "i18next";
import { translate } from "react-i18next";
import debounce from "lodash.debounce";
import { ignoreCancel, makeCancelable, padNumber } from "../../util";
import api from "../../util/api";
import "react-table/react-table.css";

class QueryLog extends Component {
  updateHandler = null;
  state = {
    history: [],
    cursor: null,
    loading: false,
    atEnd: false,
    filtersChanged: false,
    filters: []
  };

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
  getRowProps = (state, rowInfo) => {
    // Check if the row is known to be blocked or allowed (not unknown)
    if (rowInfo && rowInfo.row.status !== 0) {
      // Blocked queries are red, allowed queries are green
      return {
        style: {
          color: [1, 4, 5, 6].includes(rowInfo.row.status) ? "red" : "green"
        }
      };
    } else {
      // Unknown queries do not get colored
      return {};
    }
  };

  /**
   * Convert the table filters into API history filters
   *
   * @param tableFilters the filters requested by the table
   * @return the filters converted for use by the API
   */
  parseFilters = tableFilters => {
    let filters = {};

    for (const filter of tableFilters) {
      switch (filter.id) {
        case "queryType":
          if (filter.value === "all") {
            // Filter is not applied
            break;
          }

          // Query Types start at 1
          filters.query_type = parseInt(filter.value) + 1;
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
  fetchQueries = ({ page, pageSize }) => {
    // Check if we've reached the end of the queries, or are still waiting for
    // the last fetch to finish
    if (this.state.atEnd || this.state.loading) {
      return;
    }

    // Check if the filters are the same and we already have this page and the
    // next page.
    if (
      !this.state.filtersChanged &&
      this.state.history.length >= (page + 2) * pageSize
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
        this.setState({
          loading: false,
          atEnd: data.cursor === null,
          cursor: data.cursor,
          history: this.state.history.concat(data.history),
          filtersChanged: false
        });
      })
      .catch(ignoreCancel);
  };

  render() {
    const { t } = this.props;

    return (
      <ReactTable
        className="-striped"
        style={{ background: "white", marginBottom: "24px", lineHeight: 1 }}
        columns={columns(t)}
        showPaginationTop={true}
        sortable={false}
        filterable={false}
        data={this.state.history}
        loading={this.state.loading}
        onFetchData={debounce(this.fetchQueries, 350)}
        onFilteredChange={debounce(filters => {
          this.setState({
            filters,
            filtersChanged: true,
            cursor: null,
            atEnd: false,
            loading: false,
            history: []
          });
        }, 300)}
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
const status = t => [
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
const dnssec = t => [
  "N/A", // Unspecified, which means DNSSEC is off, so nothing should be shown
  t("Secure"),
  t("Insecure"),
  t("Bogus"),
  t("Abandoned"),
  t("Unknown")
];

const dnssecColor = [
  "", // Unspecified, which means DNSSEC is off, so the initial color should be shown
  "green",
  "orange",
  "red",
  "red",
  "red"
];

/**
 * Convert a reply type code to a reply type. The unknown type is translated, so
 * you must pass in the translation function before using the message array.
 */
const replyTypes = t => [
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
const selectionFilter = (items, t, extras = []) => {
  return ({ filter, onChange }) => (
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
const columns = t => [
  {
    Header: t("Time"),
    id: "time",
    accessor: r => r.timestamp,
    width: 70,
    Cell: row => {
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
    }
  },
  {
    Header: t("Type"),
    id: "queryType",
    accessor: r => queryTypes[r.type - 1],
    width: 50,
    filterable: true,
    filterMethod: () => true, // Don't filter client side
    Filter: selectionFilter(queryTypes, t)
  },
  {
    Header: t("Domain"),
    id: "domain",
    accessor: r => r.domain,
    minWidth: 150,
    className: "horizontal-scroll",
    filterable: true,
    filterMethod: () => true // Don't filter client side
  },
  {
    Header: t("Client"),
    id: "client",
    accessor: r => r.client,
    minWidth: 120,
    className: "horizontal-scroll",
    filterable: true,
    filterMethod: () => true // Don't filter client side
  },
  {
    Header: t("Status"),
    id: "status",
    accessor: r => r.status,
    width: 140,
    Cell: row => status(t)[row.value],
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
    accessor: r => r.dnssec,
    width: 90,
    Cell: row => (
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
    accessor: r => ({ type: r.reply, time: r.response_time }),
    width: 90,
    Cell: row => (
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
    Cell: data => {
      // Blocked, but can whitelist
      if ([1, 4, 5].includes(data.row.status.code)) {
        return (
          <button
            type="button"
            className="btn btn-success full-width"
            onClick={() => api.addWhitelist(data.row.domain)}
          >
            {t("Whitelist")}
          </button>
        );
      }

      // Not explicitly blocked (or is whitelisted), but could be blocked.
      // This includes externally blocked.
      if ([2, 3, 6].includes(data.row.status.code))
        return (
          <button
            type="button"
            className="btn btn-danger full-width"
            onClick={() => api.addBlacklist(data.row.domain)}
          >
            {t("Blacklist")}
          </button>
        );
    }
  }
];

export default translate(["common", "query-log"])(QueryLog);
