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
import { api, validate } from "../../utils";

class DomainInput extends Component {
  state = {
    domain: "",
    isValid: true
  };

  handleChange = (e) => {
    const domain = e.target.value;
    this.setState({ domain });
    const isValid = validate.domain(domain);
    this.setState({ domain, isValid });
    if (isValid){
      this.props.onInputValidate(null);
    } else {
      this.props.onInputValidate("Not valid domain format (use example.com or sub.example.com")
    }
  };


  onAdd = () => {
    if(this.state.domain.length > 0) {
      if (this.state.isValid) {
        this.props.onEnter(this.state.domain);

        this.setState({ domain: "" });
      }
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div className="form-group input-group">
        <input
          type="text" className={`form-control ${(this.state.isValid) ? "" : "is-invalid"}`} placeholder={this.props.placeholder}
          value={this.state.domain}
          onKeyPress={e => e.key === 'Enter' ? this.onAdd() : null}
          onChange={this.handleChange}
          disabled={!api.loggedIn}
        />
        <span className="btn-group input-group-append">
          {
            api.loggedIn ?
              <button
                onClick={this.onAdd}
                className="btn border-secondary"
                type="button"
                disabled={!this.state.isValid}
              >
                {t("Add")}
              </button>
              : null
          }
          <button onClick={this.props.onRefresh} className="btn border-secondary" type="button">
            <i className="fa fa-refresh"/>
          </button>
        </span>
      </div>
    );
  }
}

DomainInput.propTypes = {
  placeholder: PropTypes.string,
  onEnter: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onInputValidate: PropTypes.func.isRequired
};

DomainInput.defaultProps = {
  placeholder: ''
};

export default translate(["common", "lists"])(DomainInput);
