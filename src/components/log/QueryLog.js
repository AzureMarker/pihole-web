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
import { ignoreCancel, makeCancelable, padNumber } from "../../util";
import api from "../../util/api";
import "react-table/react-table.css";

class QueryLog extends Component {
  updateHandler = null;
  state = {
    history: [],
    cursor: null,
    loading: false,
    atEnd: false
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
    if (rowInfo && rowInfo.row.status.code !== 0) {
      // Blocked queries are red, allowed queries are green
      return {
        style: {
          color: [1, 4, 5, 6].includes(rowInfo.row.status.code)
            ? "red"
            : "green"
        }
      };
    } else {
      // Unknown queries do not get colored
      return {};
    }
  };

  /**
   * Fetch queries from the API, if necessary. This is called from the
   * ReactTable component, which dictates its parameters.
   *
   * @param state The state of the ReactTable. Only the page and pageSize
   * attributes are used.
   */
  fetchQueries = state => {
    // Check if we've reached the end of the queries, or are still waiting for
    // the last fetch to finish
    if (this.state.atEnd || this.state.loading) {
      return;
    }

    // Check if we already have this page and the next page.
    if (this.state.history.length >= (state.page + 2) * state.pageSize) {
      return;
    }

    // We have to ask the API for more queries
    this.setState({ loading: true });

    // Send a request for more queries
    this.updateHandler = makeCancelable(
      api.getHistory({
        cursor: this.state.cursor
      })
    );

    this.updateHandler.promise
      .then(data => {
        // Update the log with the new queries
        this.setState({
          loading: false,
          atEnd: data.cursor === null,
          cursor: data.cursor,
          history: this.state.history.concat(data.history)
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
        onFetchData={this.fetchQueries}
        getTrProps={this.getRowProps}
        ofText={this.state.atEnd ? "of" : "of at least"}
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
  "", // Unspecified, which means DNSSEC is off, so nothing should be shown
  t("Secure"),
  t("Insecure"),
  t("Bogus"),
  t("Abandoned"),
  t("Unknown")
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
const queryTypes = ["ERROR", "A", "AAAA", "ANY", "SRV", "SOA", "PTR", "TXT"];

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
    id: "type",
    accessor: r => queryTypes[r.type],
    width: 50
  },
  {
    Header: t("Domain"),
    id: "domain",
    accessor: r => r.domain,
    minWidth: 150,
    className: "horizontal-scroll"
  },
  {
    Header: t("Client"),
    id: "client",
    accessor: r => r.client,
    minWidth: 120,
    className: "horizontal-scroll"
  },
  {
    Header: t("Status"),
    id: "status",
    accessor: r => ({ code: r.status, dnssec: r.dnssec }),
    width: 140,
    Cell: row => (
      <Fragment>
        {status(t)[row.value.code]}
        <br />
        {dnssec(t)[row.value.dnssec]}
      </Fragment>
    ),
    filterMethod: (filter, row) => {
      const rowStatus = status(t)[row[filter.id].code].toLowerCase();
      return rowStatus.includes(filter.value.toLowerCase());
    }
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
    )
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
