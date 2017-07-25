import React, { Component } from 'react';
import { api, makeCancelable } from '../../utils';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class QueryLog extends Component {
  updateHandler = null;

  constructor(props) {
    super(props);

    this.state = {
      history: [],
      loading: true
    };

    this.updateTable = this.updateTable.bind(this);
  }

  updateTable() {
    this.updateHandler = makeCancelable(api.getHistory());
    this.updateHandler.promise.then(data => {
      this.setState({
        history: data.history,
        loading: false
      });
    });
  }

  componentDidMount() {
    this.updateTable();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">Query Log</div>
        <div className="card-block">
          <ReactTable
            className="-striped"
            columns={columns}
            showPaginationTop={true}
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
            }} />
        </div>
      </div>
    );
  }
}

const columns = [
  {
    Header: "Time",
    id: "time",
    accessor: r => r[0],
    minWidth: 80,
    Cell: row => {
      const date = new Date(row.value * 1000);

      return date.toLocaleTimeString();
    }
  },
  {
    Header: "Type",
    id: "type",
    accessor: r => r[1],
    minWidth: 50
  },
  {
    Header: "Domain",
    id: "domain",
    accessor: r => r[2],
    minWidth: 240
  },
  {
    Header: "Client",
    id: "client",
    accessor: r => r[3],
    minWidth: 140
  },
  {
    Header: "Status",
    id: "status",
    accessor: r => r[4],
    minWidth: 120,
    Cell: row => {
      switch(row.value) {
        case 1:
          return "Blocked";
        case 2:
          return "Allowed (forwarded)";
        case 3:
          return "Allowed (cached)";
        case 4:
          return "Blocked (wildcard)";
        case 5:
          return "Blocked (blacklist)";
        default:
          return "Unknown";
      }
    }
  },
  {
    Header: "Action",
    minWidth: 100
  }
];

export default QueryLog;