/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Login page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import sha from 'sha.js';
import { api } from "../utils";
import logo from '../img/logo.svg';

export default class Login extends Component {
  state = {
    password: '',
    error: false,
    forgotPasswordCollapsed: true
  };

  handlePasswordChange = e => {
    if(e.keyCode === 13)
      this.onAuth();
    else
      this.setState({ password: e.target.value })
  };

  onAuth = () => {
    // Hash the password twice before sending to the API
    let hashedPassword = sha("sha256").update(this.state.password).digest("hex");
    hashedPassword = sha("sha256").update(hashedPassword).digest("hex");

    api.authenticate(hashedPassword)
      .then(() => {
        // Assume it's ok since there was no error
        // TODO: verify response
        // TODO: transition to logged in mode
        console.log("Logged In");
      })
      .catch(() => this.setState({ error: true }));

    this.setState({ password: '', error: false });
  };

  render() {
    return (
      <div className="mainbox col-md-8 offset-md-2 col-lg-6 offset-lg-3" style={{'float': 'none'}}>
        <div className="card">
          <div className="card-header">
            <div style={{'textAlign': 'center'}}>
              <img src={logo} alt="Logo" width="30%"/>
            </div>
            <br/>

            <div className="card-title text-center" style={{'marginBottom': 0}}>
              <span className="logo-lg" style={{'fontSize': '25px'}}>
                Pi-<b>hole</b>
              </span>
            </div>
            <p className="login-box-msg">
              Sign in to start your session
            </p>
            <div id="cookieInfo" className="card-title text-center" style={{'color': '#F00', 'fontSize': '150%'}} hidden>
              Verify that cookies are allowed for <code>{window.location.host}</code>
            </div>
            {
              this.state.error
                ?
                <div className="form-group has-error login-box-msg">
                  <label className="control-label">
                    <i className="fa fa-times-circle-o"/> Wrong password!
                  </label>
                </div>
                :
                null
            }
          </div>

          <div className="card-body">
            <form id="loginform">
              <div className={'form-group' + (this.state.error ? ' has-error' : '')}>
                <input type="password" className="form-control"
                       value={this.state.password} onChange={this.handlePasswordChange}
                       placeholder="Password" autoFocus/>
              </div>
              <div className="row">
                <div className="col-8">
                  <ul style={{'paddingLeft': '10px'}}>
                    <li><samp>Return</samp> &rarr; Log in</li>
                    <li><samp>Ctrl+Return</samp> &rarr; Log in and go to Settings page</li>
                  </ul>
                </div>
                <div className="col-4">
                  <button type="submit" href="#" className="btn btn-primary pull-right" onClick={this.onAuth}>
                    Log in
                  </button>
                </div>
              </div>
              <br/>
                <div className="row">
                  <div style={{'width': '100%'}}>
                    <div className={'card ' + (this.state.error ? 'border-danger': 'border-primary collapsed-card')}>
                      <div className={'card-header ' + (this.state.error ? 'bg-danger' : 'bg-primary')}
                           style={{'paddingRight': '10px', 'paddingBottom': "0px"}}>
                        <h3 className="card-title" style={{'fontSize': '18px', 'display': 'inline-block', 'margin': 0}}>
                          Forgot password
                        </h3>

                        <span className="pull-right">
                          <button type="button" className="btn btn-card-tool"
                                  style={{ 'cursor': 'pointer', 'padding': '10px' }} onClick={() => {
                                    this.setState({ forgotPasswordCollapsed: !this.state.forgotPasswordCollapsed })
                                  }}>
                            <i className={'fa ' + (!this.state.forgotPasswordCollapsed !== this.state.error ? 'fa-minus' : 'fa-plus')}/>
                          </button>
                        </span>
                      </div>
                      <div id="forgotPassword"
                           className={'card-body bg-light' + (this.state.forgotPasswordCollapsed !== this.state.error ? ' collapse' : '')}
                           style={{'padding': '10px'}}>
                        After installing Pi-hole for the first time, a password is generated and displayed to the user.
                        The password cannot be retrieved later on, but it is possible to set a new password (or
                        explicitly disable the password by setting an empty password) using the command:
                        <pre style={{'textAlign': 'center'}}>sudo pihole -a -p</pre>
                      </div>
                    </div>
                  </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}