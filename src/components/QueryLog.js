/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Query Log component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import ReactTable from 'react-table';
import { api, ignoreCancel, makeCancelable, padNumber } from '../utils';
import 'react-table/react-table.css';

export default class QueryLog extends Component {
  updateHandler = null;
  state = {
    history: [],
    loading: true
  };

  constructor(props) {
    super(props);
    this.updateTable = this.updateTable.bind(this);
  }

  updateTable() {
    this.updateHandler = makeCancelable(api.getHistory());
    this.updateHandler.promise.then(data => {
      this.setState({
        history: data,
        loading: false
      });
    }).catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateTable();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <ReactTable
        className="-striped"
        style={{ background: "white", marginBottom: "24px" }}
        columns={columns}
        showPaginationTop={true}
        filterable={true}
        data={this.state.history}
        loading={this.state.loading}
        getTrProps={(state, rowInfo) => {
          if(rowInfo && rowInfo.row.status !== 0)
            return {
              style: {
                color: [1, 4, 5].includes(rowInfo.row.status) ? 'red' : 'green'
              }
            };
          else
            return {};
        }}
        defaultSorted={[{
          id: "time",
          desc: true
        }]} />
    );
  }
}

const status = {
  "1": "Blocked",
  "2": "Allowed (forwarded)",
  "3": "Allowed (cached)",
  "4": "Blocked (wildcard)",
  "5": "Blocked (blacklist)"
};

const columns = [
  {
    Header: "Time",
    id: "time",
    accessor: r => r[0],
    width: 70,
    Cell: row => {
      const date = new Date(row.value * 1000);

      return `${padNumber(date.getHours())}-${padNumber(date.getMinutes())}-${padNumber(date.getSeconds())}`;
    }
  },
  {
    Header: "Type",
    id: "type",
    accessor: r => r[1],
    width: 45
  },
  {
    Header: "Domain",
    id: "domain",
    accessor: r => r[2],
    minWidth: 200,
    className: "horizontal-scroll"
  },
  {
    Header: "Client",
    id: "client",
    accessor: r => r[3],
    minWidth: 120,
    className: "horizontal-scroll"
  },
  {
    Header: "Status",
    id: "status",
    accessor: r => r[4],
    width: 140,
    Cell: row => status[row.value],
    filterMethod: (filter, row) =>
      status[row[filter.id]]
        .toLowerCase()
        .includes(
          filter.value.toLowerCase()
        )
  },
  {
    Header: "Action",
    width: 100,
    filterable: false,
    Cell: data => {
      if([1, 4, 5].includes(data.row.status))
        return (
          <button type="button" className="btn btn-success full-width" onClick={() => api.addWhitelist(data.row.domain)}>
            Whitelist
          </button>
        );
      if([2, 3].includes(data.row.status))
        return (
          <button type="button" className="btn btn-danger full-width" onClick={() => api.addBlacklist(data.row.domain)}>
            Blacklist
          </button>
        );
    }
  }
];
