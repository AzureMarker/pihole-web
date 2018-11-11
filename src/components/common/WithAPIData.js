/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  WithAPIData Component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import { Component } from "react";
import PropTypes from "prop-types";
import { ignoreCancel, makeCancelable, Result } from "../../util";

/**
 * A component for getting API data. It can retrieve information once,
 * periodically, or on call (refresh).
 */
export class WithAPIData extends Component {
  static propTypes = {
    apiCall: PropTypes.func.isRequired,
    repeatOptions: PropTypes.shape({
      ignoreCancel: PropTypes.bool,
      interval: PropTypes.number
    }),

    /**
     * Render the children before the first API request is done
     */
    renderInitial: PropTypes.func.isRequired,

    /**
     * Render the children if the API request succeeded
     *
     * @param data the data returned from the API call
     * @param refresh a function to trigger an asynchronous data refresh
     */
    renderOk: PropTypes.func.isRequired,

    /**
     * Render the children if the API request failed
     *
     * @param error the error returned from the API call
     * @param refresh a function to trigger an asynchronous data refresh
     */
    renderErr: PropTypes.func.isRequired
  };

  static defaultProps = {
    repeatOptions: {
      ignoreCancel: true,
      interval: 0
    }
  };

  state = {
    apiResult: null
  };

  loadData = () => {
    // Only repeat if there is a non-zero repeat interval
    const cancelOptions = {
      repeat: this.props.repeatOptions.interval !== 0 ? this.loadData : null,
      interval: this.props.repeatOptions.interval
    };

    this.dataHandle = makeCancelable(this.props.apiCall(), cancelOptions);

    this.dataHandle.promise
      .then(data => {
        this.setState({
          apiResult: Result.Ok(data)
        });
      })
      .catch(error => {
        if (this.props.repeatOptions.ignoreCancel) {
          ignoreCancel(error);
        } else {
          throw error;
        }
      })
      .catch(error => {
        this.setState({
          apiResult: Result.Err(error)
        });
      });
  };

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    this.dataHandle.cancel();
  }

  render() {
    if (!this.state.apiResult) {
      return this.props.renderInitial();
    }

    if (Result.isOk(this.state.apiResult)) {
      return this.props.renderOk(this.state.apiResult.value, this.loadData);
    } else {
      return this.props.renderErr(this.state.apiResult.value, this.loadData);
    }
  }
}
