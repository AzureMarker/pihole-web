/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Domain List component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ignoreCancel, makeCancelable } from "../utils";

export default class DomainList extends Component {
  onRemove(domain) {
    if(this.props.domains.includes(domain)) {
      const prevDomains = this.props.domains.slice();

      this.removeHandler = makeCancelable(this.props.apiCall(domain));
      this.removeHandler.promise.catch(ignoreCancel).catch(() => {
        this.props.onFailed(domain, prevDomains);
      });

      this.props.onRemoved(domain);
    }
  }

  render() {
    return (
      <ul className="list-group">
        {
          this.props.domains.length > 0
            ?
            this.props.domains.map(item => (
              <li key={item} className="list-group-item">
                <button className="btn btn-danger btn-sm pull-right" type="button" onClick={() => this.onRemove(item)}>
                  <span className="fa fa-trash-o"/>
                </button>
                <span style={{ display: "table-cell", verticalAlign: "middle", height: "32px" }}>
                {item}
              </span>
              </li>
            ))
            :
            <div className="alert alert-info" role="alert">
              There are no domains in this list
            </div>
        }
      </ul>
    );
  }
};

DomainList.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemoved: PropTypes.func.isRequired,
  onFailed: PropTypes.func.isRequired,
  apiCall: PropTypes.func.isRequired
};