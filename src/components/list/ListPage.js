/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  List Page component (abstracted whitelist, blacklist, etc)
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import DomainInput from "./DomainInput";
import Alert from "../common/Alert";
import DomainList from "./DomainList";
import { ignoreCancel, makeCancelable } from "../../utils";

class ListPage extends Component {
  state = {
    domains: [],
    infoMsg: "",
    successMsg: "",
    errorMsg: ""
  };

  onEnter = domain => {
    // Check if the domain was already added
    if (this.state.domains.includes(domain)) {
      this.onAlreadyAdded(domain);
    } else {
      // Store the domains before adding the new domain, for a possible rollback
      const prevDomains = this.state.domains.slice();

      // Try to add the domain
      this.addHandler = makeCancelable(this.props.add(domain));
      this.addHandler.promise
        .then(() => {
          this.onAdded(domain);
        })
        .catch(ignoreCancel)
        .catch(() => {
          this.onAddFailed(domain, prevDomains);
        });

      // Show an in-progress message
      this.onAdding(domain);
    }
  };

  onAdding = domain =>
    this.setState({
      infoMsg: this.props.t("Adding {{domain}}...", { domain }),
      successMsg: "",
      errorMsg: ""
    });

  onAlreadyAdded = domain =>
    this.setState({
      infoMsg: "",
      successMsg: "",
      errorMsg: this.props.t("{{domain}} is already added", { domain })
    });

  onAdded = domain =>
    this.setState(prevState => ({
      domains: [...prevState.domains, domain],
      infoMsg: "",
      successMsg: this.props.t("Successfully added {{domain}}", { domain }),
      errorMsg: ""
    }));

  onAddFailed = (domain, prevDomains) =>
    this.setState({
      domains: prevDomains,
      infoMsg: "",
      successMsg: "",
      errorMsg: this.props.t("Failed to add {{domain}}", { domain })
    });

  onRemoved = domain =>
    this.setState(prevState => ({
      domains: prevState.domains.filter(item => item !== domain)
    }));

  onRemoveFailed = (domain, prevDomains) =>
    this.setState({
      domains: prevDomains,
      infoMsg: "",
      successMsg: "",
      errorMsg: this.props.t("Failed to remove {{domain}}", { domain })
    });

  onRefresh = () => {
    this.refreshHandler = makeCancelable(this.props.refresh());
    this.refreshHandler.promise
      .then(data => {
        this.setState({ domains: data });
      })
      .catch(ignoreCancel);
  };

  handleValidationError = () => {
    this.setState({
      errorMsg: this.props.validationErrorMsg
    });
  };

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount() {
    if (this.addHandler) this.addHandler.cancel();

    if (this.removeHandler) this.removeHandler.cancel();

    if (this.refreshHandler) this.refreshHandler.cancel();
  }

  render() {
    return (
      <div style={{ marginBottom: "24px" }}>
        <h2 className="text-center">{this.props.title}</h2>
        <br />
        <DomainInput
          placeholder={this.props.placeholder}
          onEnter={this.onEnter}
          onRefresh={this.onRefresh}
          isValid={this.props.isValid}
          onValidationError={this.handleValidationError}
        />
        {this.props.note}
        {this.state.infoMsg ? (
          <Alert
            message={this.state.infoMsg}
            type="info"
            onClick={() => this.setState({ infoMsg: "" })}
          />
        ) : null}
        {this.state.successMsg ? (
          <Alert
            message={this.state.successMsg}
            type="success"
            onClick={() => this.setState({ successMsg: "" })}
          />
        ) : null}
        {this.state.errorMsg ? (
          <Alert
            message={this.state.errorMsg}
            type="danger"
            onClick={() => this.setState({ errorMsg: "" })}
          />
        ) : null}
        <DomainList
          domains={this.state.domains}
          apiCall={this.props.remove}
          onRemoved={this.onRemoved}
          onFailed={this.onRemoveFailed}
        />
      </div>
    );
  }
}

ListPage.propTypes = {
  title: PropTypes.string.isRequired,
  note: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placeholder: PropTypes.string.isRequired,
  add: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  validationErrorMsg: PropTypes.string.isRequired
};

export default translate(["common", "lists"])(ListPage);
