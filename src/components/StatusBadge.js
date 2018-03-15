import React, { Component } from 'react';
import { api, makeCancelable, ignoreCancel } from '../utils';

export default class StatusBadge extends Component {
  state = {
    status: "enabled"
  };

  updateStatus = () => {
    this.updateHandler = makeCancelable(api.getStatus(), { repeat: this.updateStatus, interval: 5000 });
    this.updateHandler.promise
      .then(res => {
        this.setState({ status: res.status });
      })
      .catch(ignoreCancel)
      .catch(() => {
        this.setState({ status: "unknown" });
      });
  };

  componentDidMount() {
    this.updateStatus();
  }

  render() {
    return (
      this.state.status === "enabled"
      ?
        <span><i className="fa fa-circle text-success"/> Online</span>
      :
        <span><i className="fa fa-circle text-danger"/> Offline</span>
    );
  }
}