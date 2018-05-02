/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Forgot Password Reminder
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ForgotPassword extends Component {
  state = {
    collapsed: true
  };

  /**
   * Handle collapsing the body when clicked
   */
  onClick = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  /**
   * @returns {Boolean|boolean} If the body should be collapsed
   */
  isCollapsed = () => this.props.error || !this.state.collapsed;

  render() {
    return (
      <div style={{'width': '100%'}}>
        <div className={'card ' + (this.props.error ? 'border-danger': 'border-primary collapsed-card')}>
          <div className={'card-header ' + (this.props.error ? 'bg-danger' : 'bg-primary')}
               style={{'paddingRight': '10px', 'paddingBottom': "0px"}}>
            <h3 className="card-title" style={{'fontSize': '18px', 'display': 'inline-block', 'margin': 0}}>
              Forgot password
            </h3>

            <span className="pull-right">
              <button type="button" className="btn btn-card-tool"
                      style={{ 'cursor': 'pointer', 'padding': '10px' }} onClick={this.onClick}>
                <i className={'fa ' + (this.isCollapsed() ? 'fa-minus' : 'fa-plus')}/>
              </button>
            </span>
          </div>
          <div className={'card-body bg-light' + (this.isCollapsed() ? '' : ' collapse')}
               style={{'padding': '10px'}}>
            After installing Pi-hole for the first time, a password is generated and displayed to the user.
            The password cannot be retrieved later on, but it is possible to set a new password (or
            explicitly disable the password by setting an empty password) using the command:
            <pre style={{'textAlign': 'center'}}>sudo pihole -a -p</pre>
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  error: PropTypes.bool.isRequired
};