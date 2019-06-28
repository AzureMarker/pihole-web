/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Domain Input component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ChangeEvent, Component, FormEvent } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";

export interface DomainInputProps {
  placeholder?: string;
  onEnter: (domain: string) => void;
  onRefresh: () => void;
  isValid: (domain: string) => boolean;
  onValidationError: () => void;
}

export interface DomainInputState {
  domain: string;
  isValid: boolean;
}

export class DomainInput extends Component<
  DomainInputProps & WithTranslation,
  DomainInputState
> {
  static defaultProps = {
    placeholder: ""
  };

  state: DomainInputState = {
    domain: "",
    isValid: true
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ domain: e.target.value });
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const domain = this.state.domain;

    // Don't do anything for empty inputs
    if (domain.length === 0) {
      return;
    }

    const isValid = this.props.isValid(domain);
    this.setState({ isValid });
    if (isValid) {
      this.props.onEnter(domain);
      // Clear the input on successful submit
      this.setState({ domain: "" });
    } else {
      this.props.onValidationError();
    }
  };

  render() {
    const { t, placeholder, onRefresh } = this.props;

    return (
      <form className="form-group input-group" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className={`form-control ${this.state.isValid ? "" : "is-invalid"}`}
          placeholder={placeholder}
          value={this.state.domain}
          onChange={this.handleChange}
          disabled={!api.loggedIn}
        />
        <span className="btn-group input-group-append">
          {api.loggedIn ? (
            <button className="btn border-secondary" type="submit">
              {t("Add")}
            </button>
          ) : null}
          <button
            onClick={onRefresh}
            className="btn border-secondary"
            type="button"
          >
            <i className="fa fa-sync" />
          </button>
        </span>
      </form>
    );
  }
}

export const DomainInputContainer = withTranslation(["common", "lists"])(
  DomainInput
);
