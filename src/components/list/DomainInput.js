/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Domain Input component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import api from "../../util/api";

class DomainInput extends Component {
  state = {
    domain: "",
    isValid: true
  };

  handleChange = e => this.setState({ domain: e.target.value });

  handleSubmit = e => {
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

DomainInput.propTypes = {
  placeholder: PropTypes.string,
  onEnter: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  onValidationError: PropTypes.func.isRequired
};

DomainInput.defaultProps = {
  placeholder: ""
};

export default withNamespaces(["common", "lists"])(DomainInput);
