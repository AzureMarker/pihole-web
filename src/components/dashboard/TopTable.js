/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Generic top items component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { ignoreCancel, makeCancelable } from "../../utils";

class TopTable extends Component {
  state = {
    loading: true,
    ...this.props.initialState
  };

  updateChart = () => {
    this.updateHandler = makeCancelable(
      this.props.apiCall(),
      { repeat: this.updateChart, interval: 10 * 60 * 1000 }
    );
    this.updateHandler.promise
      .then(res => this.props.apiHandler(this, res))
      .catch(ignoreCancel);
  };

  generateTable = () => {
    if(this.props.isEmpty(this.state)) {
      return this.props.emptyMessage;
    }

    return (
      <table className="table table-bordered">
        <tbody>
        <tr>
          {this.props.headers.map((header, i) => <th key={i}>{header}</th>)}
        </tr>
        {this.props.generateRows(this.state)}
        </tbody>
      </table>
    );
  };

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          {this.props.title}
        </div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            {this.generateTable()}
          </div>
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

TopTable.propTypes = {
  title: PropTypes.string.isRequired,
  initialState: PropTypes.object,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  emptyMessage: PropTypes.string.isRequired,
  isEmpty: PropTypes.func.isRequired,
  apiCall: PropTypes.func.isRequired,
  apiHandler: PropTypes.func.isRequired,
  generateRows: PropTypes.func.isRequired
};

TopTable.defaultProps = {
  initialState: {}
};

export default TopTable;
