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
import { WithTranslation, withTranslation } from "react-i18next";
import { DomainInputContainer } from "./DomainInput";
import Alert, { AlertType } from "../common/Alert";
import DomainList from "./DomainList";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";

export interface ListPageProps {
  title: string;
  note?: {} | string;
  placeholder: string;
  onAdd: (domain: string) => Promise<any | never>;
  onRefresh: () => Promise<any | never>;
  onRemove: (domain: string) => Promise<any | never>;
  isValid: (domain: string) => boolean;
  validationErrorMsg: string;
}

export interface ListPageState {
  domains: string[];
  message: string;
  messageType: AlertType;
}

export class ListPage extends Component<
  ListPageProps & WithTranslation,
  ListPageState
> {
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
      this.addHandler = makeCancelable(this.props.onAdd(domain));
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
    this.setState((prevState, prevProps) => ({
      message: prevProps.t("Adding {{domain}}...", { domain }),
      messageType: "info"
    }));

  onAlreadyAdded = (domain: string) =>
    this.setState((prevState, prevProps) => ({
      message: prevProps.t("{{domain}} is already added", { domain }),
      messageType: "danger"
    }));

  onAdded = (domain: string) =>
    this.setState(prevState => ({
      domains: [...prevState.domains, domain],
      message: this.props.t("Successfully added {{domain}}", { domain }),
      messageType: "success"
    }));

  onAddFailed = (domain: string, prevDomains: string[]) =>
    this.setState((prevState, prevProps) => ({
      domains: prevDomains,
      message: prevProps.t("Failed to add {{domain}}", { domain }),
      messageType: "danger"
    }));

  onRemoved = (domain: string) =>
    this.setState(prevState => ({
      domains: prevState.domains.filter(item => item !== domain)
    }));

  onRemoveFailed = (domain: string, prevDomains: string[]) =>
    this.setState((prevState, prevProps) => ({
      domains: prevDomains,
      message: prevProps.t("Failed to remove {{domain}}", { domain }),
      messageType: "danger"
    }));

  onRemove = (domain: string) => {
    if (this.state.domains.includes(domain)) {
      const prevDomains = this.state.domains.slice();

      this.removeHandler = makeCancelable(this.props.onRemove(domain));
      this.removeHandler.promise.catch(ignoreCancel).catch(() => {
        this.onRemoveFailed(domain, prevDomains);
      });

      this.onRemoved(domain);
    }
  };

  onRefresh = () => {
    this.refreshHandler = makeCancelable(this.props.onRefresh());
    this.refreshHandler.promise
      .then(data => {
        this.setState({ domains: data });
      })
      .catch(ignoreCancel);
  };

  handleValidationError = () => {
    this.setState((prevState, prevProps) => ({
      message: prevProps.validationErrorMsg,
      messageType: "danger"
    }));
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
      <div className="mb-4">
        <h2 className="text-center">{this.props.title}</h2>
        <br />
        <DomainInputContainer
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

export default withTranslation(["common", "lists"])(ListPage);
