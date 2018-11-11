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
  static propTypes = {
    title: PropTypes.string.isRequired,
    note: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    placeholder: PropTypes.string.isRequired,
    add: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validationErrorMsg: PropTypes.string.isRequired
  };

  static defaultProps = {
    note: ""
  };

  state = {
    domains: [],
    message: "",
    messageType: ""
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
      message: this.props.t("Adding {{domain}}...", { domain }),
      messageType: "info"
    });

  onAlreadyAdded = domain =>
    this.setState({
      message: this.props.t("{{domain}} is already added", { domain }),
      messageType: "danger"
    });

  onAdded = domain =>
    this.setState(prevState => ({
      domains: [...prevState.domains, domain],
      message: this.props.t("Successfully added {{domain}}", { domain }),
      messageType: "success"
    }));

  onAddFailed = (domain, prevDomains) =>
    this.setState({
      domains: prevDomains,
      message: this.props.t("Failed to add {{domain}}", { domain }),
      messageType: "danger"
    });

  onRemoved = domain =>
    this.setState(prevState => ({
      domains: prevState.domains.filter(item => item !== domain)
    }));

  onRemoveFailed = (domain, prevDomains) =>
    this.setState({
      domains: prevDomains,
      message: this.props.t("Failed to remove {{domain}}", { domain }),
      messageType: "danger"
    });

  onRemove = domain => {
    if (this.state.domains.includes(domain)) {
      const prevDomains = this.state.domains.slice();

      this.removeHandler = makeCancelable(this.props.remove(domain));
      this.removeHandler.promise.catch(ignoreCancel).catch(() => {
        this.onRemoveFailed(domain, prevDomains);
      });

      this.onRemoved(domain);
    }
  };

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
      message: this.props.validationErrorMsg,
      messageType: "danger"
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
        {this.state.message ? (
          <Alert
            message={this.state.message}
            type={this.state.messageType}
            onClick={() => this.setState({ message: "" })}
          />
        ) : null}
        <DomainList domains={this.state.domains} onRemove={this.onRemove} />
      </div>
    );
  }
}

export default translate(["common", "lists"])(ListPage);
