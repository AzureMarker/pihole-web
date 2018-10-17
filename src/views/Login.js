/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Login page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import sha from "sha.js";
import { api } from "../utils";
import logo from "../img/logo.svg";
import { routes } from "../routes";
import ForgotPassword from "../components/login/ForgotPassword";
import { translate } from "react-i18next";
import config from "../config";

class Login extends Component {
  state = {
    password: "",
    error: false,
    cookiesEnabled: false
  };

  componentWillMount() {
    // Check if cookies are enabled
    if(navigator.cookieEnabled)
      this.setState({ cookiesEnabled: true });
  }

  /**
   * Called when the user types into the password box.
   * If they clicked Enter, try to authenticate them.
   * Otherwise update the password in the state.
   *
   * @param e the event
   */
  handlePasswordChange = e => {
    if(e.keyCode === 13)
      this.authenticate();
    else
      this.setState({ password: e.target.value });
  };

  /**
   * Try to authenticate the user
   */
  authenticate = e => {
    // Prevent the page from reloading when the user gets redirected
    e.preventDefault();

    // Hash the password twice before sending to the API
    let hashedPassword = sha("sha256").update(this.state.password).digest("hex");
    hashedPassword = sha("sha256").update(hashedPassword).digest("hex");

    // Clear the state
    this.setState({ password: "", error: false });

    // Send the password to the API to authenticate the user
    api.authenticate(hashedPassword)
      .then(data => {
        // Verify status
        if(data.status !== "success") {
          console.log("Failed to log in:");
          console.log(data);
          return;
        }

        api.loggedIn = true;

        if(config.fakeAPI) {
          // When using the fake API, set the cookie ourselves
          document.cookie = "user_id=;";
        }

        // Redirect to the page the user was originally going to, or if that doesn't exist, go to home
        const locationState = this.props.location.state || "/";
        this.props.history.push(locationState.from.pathname);
      })
      // If there was an error, tell the user they used the wrong password
      .catch(() => this.setState({ error: true }));
  };

  render() {
    // If the user is already logged in, then go to the home page
    if(api.loggedIn)
      return <Redirect to="/"/>;

    const { t } = this.props;

    return (
      <div className="mainbox col-md-8 offset-md-2 col-lg-6 offset-lg-3" style={{ "float": "none" }}>
        <div className="card">
          <div className="card-header">
            <div style={{ "textAlign": "center" }}>
              <img src={logo} alt="Logo" width="30%"/>
            </div>
            <br/>

            <div className="card-title text-center" style={{ "marginBottom": 0 }}>
              <span className="logo-lg" style={{ "fontSize": "25px" }}>
                Pi-<b>hole</b>
              </span>
            </div>
            <div className="login-box-msg">
              {t("Sign in to start your session")}
              {
                // If the user tried to go to a protected page and is not logged in,
                // tell them they will be redirected once login is successful
                this.props.location.state && this.props.location.state.from.pathname in routes(t) ?
                  (
                    <Fragment>
                      <br/>
                      {t(
                        "You will be transferred to the \"{{page}}\" page",
                        { page: routes(t)[this.props.location.state.from.pathname] }
                      )}
                    </Fragment>
                  ) : null
              }
              {
                // If cookies are not enabled (or detected), show a warning
                !this.state.cookiesEnabled ?
                  <div className="text-center" style={{ "color": "#F00" }}>
                    {t("Verify that cookies are allowed for {{host}}", { host: window.location.host })}
                  </div>
                  : null
              }
            </div>
            {
              this.state.error
                ?
                <div className="form-group has-error login-box-msg">
                  <label className="control-label">
                    <i className="fa fa-times-circle-o"/> {t("Wrong Password!")}
                  </label>
                </div>
                : null
            }
          </div>

          <div className="card-body">
            <form id="loginform">
              <div className={"input-group" + (this.state.error ? " has-error" : "")}>
                <input type="password" className="form-control"
                       value={this.state.password} onChange={this.handlePasswordChange}
                       placeholder={t("Password")} autoFocus/>
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary" onClick={this.authenticate}>
                    {t("Log in")}
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

export default translate(["login", "location"])(Login);