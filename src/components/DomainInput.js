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
      if(this.props.domains.includes(this.state.domain))
        this.props.onAlreadyAdded(this.state.domain);
      else {
        const prevDomains = this.props.domains.slice();
        const domain = this.state.domain;

        this.addHandler = makeCancelable(this.props.apiCall(this.state.domain));
        this.addHandler.promise.then(() => {
          this.props.onAdded(domain)
        }).catch(ignoreCancel).catch(() => {
          this.props.onFailed(domain, prevDomains)
        });

        this.props.onAdding(this.state.domain)
      }

      this.setState({ domain: "" });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div className="form-group input-group">
        <input
          type="text" className="form-control" placeholder={t("Add a domain (example.com or sub.example.com)")}
          value={this.state.domain} onKeyPress={(e) => e.charCode === 13 ? this.onAdd() : null}
          onChange={this.handleChange}
          disabled={!api.loggedIn}
        />
        <span className="input-group-btn">
          {
            api.loggedIn ?
              <button onClick={this.onAdd} className="btn btn-secondary" type="button">
                {t("Add")}
              </button>
              : null
          }
          <button onClick={this.props.onRefresh} className="btn btn-secondary" type="button">
            <i className="fa fa-refresh"/>
          </button>
        </span>
      </div>
    );
  }
}

DomainInput.propTypes = {
  domains: PropTypes.array.isRequired,
  onAdding: PropTypes.func.isRequired,
  onAlreadyAdded: PropTypes.func.isRequired,
  onAdded: PropTypes.func.isRequired,
  onFailed: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  apiCall: PropTypes.func.isRequired
};

export default translate(["common", "lists"])(DomainInput);
