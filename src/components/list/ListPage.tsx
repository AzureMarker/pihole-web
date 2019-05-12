/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * List Page component (abstracted whitelist, blacklist, etc)
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import DomainInput from "./DomainInput";
import Alert, { AlertType } from "../common/Alert";
import DomainList from "./DomainList";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";

export interface ListPageProps extends WithNamespaces {
  title: string;
  note?: {} | string;
  placeholder: string;
  add: (domain: string) => Promise<any | never>;
  refresh: () => Promise<any | never>;
  remove: (domain: string) => Promise<any | never>;
  isValid: (domain: string) => boolean;
  validationErrorMsg: string;
}

export interface ListPageState {
  domains: string[];
  message: string;
  messageType: AlertType;
}

export class ListPage extends Component<ListPageProps, ListPageState> {
  static defaultProps = {
    note: ""
  };

  state: ListPageState = {
    domains: [],
    message: "",
    messageType: "info"
  };

  private addHandler: undefined | CancelablePromise<any | never>;
  private removeHandler: undefined | CancelablePromise<any | never>;
  private refreshHandler: undefined | CancelablePromise<any | never>;

  onEnter = (domain: string) => {
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

  onAdding = (domain: string) =>
    this.setState({
      message: this.props.t("Adding {{domain}}...", { domain }),
      messageType: "info"
    });

  onAlreadyAdded = (domain: string) =>
    this.setState({
      message: this.props.t("{{domain}} is already added", { domain }),
      messageType: "danger"
    });

  onAdded = (domain: string) =>
    this.setState(prevState => ({
      domains: [...prevState.domains, domain],
      message: this.props.t("Successfully added {{domain}}", { domain }),
      messageType: "success"
    }));

  onAddFailed = (domain: string, prevDomains: string[]) =>
    this.setState({
      domains: prevDomains,
      message: this.props.t("Failed to add {{domain}}", { domain }),
      messageType: "danger"
    });

  onRemoved = (domain: string) =>
    this.setState(prevState => ({
      domains: prevState.domains.filter(item => item !== domain)
    }));

  onRemoveFailed = (domain: string, prevDomains: string[]) =>
    this.setState({
      domains: prevDomains,
      message: this.props.t("Failed to remove {{domain}}", { domain }),
      messageType: "danger"
    });

  onRemove = (domain: string) => {
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

export default withNamespaces(["common", "lists"])(ListPage);
