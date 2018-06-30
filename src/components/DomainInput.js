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
import { api, ignoreCancel, makeCancelable } from "../utils";

class DomainInput extends Component {
  state = {
    domain: ""
  };

  handleChange = (e) =>
    this.setState({ domain: e.target.value });

  onAdd = () => {
    if(this.state.domain.length > 0) {
      this.props.onEnter(domain);

      this.setState({ domain: "" });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div className="form-group input-group">
        <input
          type="text" className="form-control" placeholder={this.props.placeholder}
          value={this.state.domain} onKeyPress={e => e.key === 'Enter' ? this.onAdd() : null}
          onChange={this.handleChange}
          disabled={!api.loggedIn}
        />
        <span className="btn-group input-group-append">
          {
            api.loggedIn ?
              <button onClick={this.onAdd} className="btn border-secondary" type="button">
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
  placeholder: PropTypes.string.isRequired,
  onEnter: PropTypes.func.isRequired,
};

export default translate(["common", "lists"])(DomainInput);
