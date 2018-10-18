/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Domain Input component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { api } from "../../utils";
import { validate } from "../../validate"

class DomainInput extends Component {
  state = {
    domain: "",
    isValid: true
  };

  handleChange = (e) => {
    const domain = e.target.value;
    this.setState({ domain });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const domain = this.state.domain;
    const isValid = validate.domain(domain);
    if (isValid) {
      this.props.onEnter(domain);
      this.setState({ domain: "" });
      this.setState({ isValid: true });
    } else {
      this.props.onValidationError({
        error: true,
        message: "Not valid domain format (use example.com or sub.example.com"
      });
      this.setState({ isValid: false });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <form className="form-group input-group" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className={`form-control ${this.state.isValid ? "is-valid" : "is-invalid"}`}
          placeholder={this.props.placeholder}
          value={this.state.domain}
          onChange={this.handleChange}
          disabled={!api.loggedIn}
        />
        <span className="btn-group input-group-append">
          {
            api.loggedIn ?
              <button
                className="btn border-secondary"
                type="submit"
              >
                {t("Add")}
              </button>
              : null
          }
          <button onClick={this.props.onRefresh} className="btn border-secondary" type="button">
            <i className="fa fa-refresh"/>
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
  onValidationError: PropTypes.func.isRequired
};

DomainInput.defaultProps = {
  placeholder: ''
};

export default translate(["common", "lists"])(DomainInput);
