/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Login page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import sha from 'sha.js';
import { api } from "../utils";
import logo from '../img/logo.svg';
import routes from "../routes";
import ForgotPassword from "../components/ForgotPassword";

export default class Login extends Component {
  state = {
    password: '',
    error: false,
    cookiesEnabled: false
  };

  componentWillMount() {
    // Check if cookies are enabled
    if(navigator.cookieEnabled)
      this.setState({ cookiesEnabled: true });
  }

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

    this.setState({ password: '', error: false });

    api.authenticate(hashedPassword)
      .then(data => {
        // Verify status
        if(data.status !== "success") {
          console.log("Failed to log in:");
          console.log(data);
          return;
        }

        api.loggedIn = true;

        // Redirect to the page the user was originally going to, or if that doesn't exist, go to home
        const redirect = this.props.location.state.from || '/';
        this.props.history.push(redirect);
      })
      .catch(() => this.setState({ error: true }));
  };

  render() {
    if(api.loggedIn)
      return <Redirect to="/"/>;

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
              {
                this.props.location.state && this.props.location.state.from.pathname in routes ?
                  (
                    <Fragment>
                      <br/>
                      You will be transferred to the {routes[this.props.location.state.from.pathname]}
                    </Fragment>
                  ) : null
              }
              {
                !this.state.cookiesEnabled ?
                  <div className="text-center" style={{'color': '#F00'}}>
                    Verify that cookies are allowed for <code>{window.location.host}</code>
                  </div>
                  : null
              }
            </p>
            {
              this.state.error
                ?
                <div className="form-group has-error login-box-msg">
                  <label className="control-label">
                    <i className="fa fa-times-circle-o"/> Wrong password!
                  </label>
                </div>
                : null
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
                  <button type="submit" className="btn btn-primary pull-right" style={{'cursor': 'pointer'}} onClick={this.onAuth}>
                    Log in
                  </button>
                </div>
              </div>
              <br/>
              <ForgotPassword error={this.state.error}/>
            </form>
          </div>
        </div>
      </div>
    );
  }
}