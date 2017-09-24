/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  List Page component (abstracted whitelist, blacklist, etc)
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DomainInput from "./DomainInput";
import Alert from "./Alert";
import DomainList from "./DomainList";
import { ignoreCancel, makeCancelable } from "../utils";

export default class ListPage extends Component {
  state = {
    domains: [],
    infoMsg: "",
    successMsg: "",
    errorMsg: ""
  };

  onAdding = domain =>
    this.setState({
      infoMsg: "Adding " + domain + " ...",
      successMsg: "",
      errorMsg: ""
    });

  onAlreadyAdded = domain =>
    this.setState({
      infoMsg: "",
      successMsg: "",
      errorMsg: domain + " is already added"
    });

  onAdded = domain =>
    this.setState(prevState => ({
      domains: [...prevState.domains, domain],
      infoMsg: "",
      successMsg: "Successfully added " + domain,
      errorMsg: ""
    }));

  onAddFailed = (domain, prevDomains) =>
    this.setState({
      domains: prevDomains,
      infoMsg: "",
      successMsg: "",
      errorMsg: "Failed to add " + domain
    });

  onRemoved = domain =>
    this.setState(prevState => ({
      domains: prevState.domains.filter(item => item !== domain)
    }));

  onRemoveFailed = (domain, prevDomains) =>
    this.setState(prevState => ({
      domains: prevDomains,
      infoMsg: "",
      successMsg: "",
      errorMsg: "Failed to remove " + domain
    }));

  onRefresh = () => {
    this.refreshHandler = makeCancelable(this.props.refresh());
    this.refreshHandler.promise.then(data => {
      this.setState({ domains: data[Object.keys(data)[0]] });
    }).catch(ignoreCancel);
  };

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount() {
    if(this.addHandler)
      this.addHandler.cancel();

    if(this.removeHandler)
      this.removeHandler.cancel();

    if(this.refreshHandler)
      this.refreshHandler.cancel();
  }

  render() {
    return (
      <div style={{ marginBottom: "24px" }}>
        <h2 className="text-center">{this.props.title}</h2>
        <br/>
        <DomainInput
          domains={this.state.domains}
          apiCall={this.props.add}
          onAdding={this.onAdding}
          onAlreadyAdded={this.onAlreadyAdded}
          onAdded={this.onAdded}
          onFailed={this.onAddFailed}
          onRefresh={this.onRefresh}/>
        {
          this.props.note
        }
        {
          this.state.infoMsg
            ? <Alert message={this.state.infoMsg} type="info" onClick={() => this.setState({ infoMsg: "" })}/>
            : null
        }
        {
          this.state.successMsg
            ? <Alert message={this.state.successMsg} type="success" onClick={() => this.setState({ successMsg: "" })}/>
            : null
        }
        {
          this.state.errorMsg
            ? <Alert message={this.state.errorMsg} type="danger" onClick={() => this.setState({ errorMsg: "" })}/>
            : null
        }
        <DomainList
          domains={this.state.domains}
          apiCall={this.props.remove}
          onRemoved={this.onRemoved}
          onFailed={this.onRemoveFailed}/>
      </div>
    );
  }
}

ListPage.propTypes = {
  title: PropTypes.string.isRequired,
  note: PropTypes.object,
  add: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
};
