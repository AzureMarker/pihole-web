/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Forgot Password Reminder
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";

export interface ForgotPasswordProps extends WithTranslation {
  error: boolean;
}

export interface ForgotPasswordState {
  collapsed: boolean;
}

class ForgotPassword extends Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  state: ForgotPasswordState = {
    collapsed: true
  };

  /**
   * Handle collapsing the body when clicked
   */
  onClick = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  /**
   * @returns {Boolean|boolean} If the body should be expanded
   */
  isExpanded = () => this.props.error || !this.state.collapsed;

  render() {
    const { t } = this.props;

    return (
      <div className="full-width">
        <div
          className={
            "card mb-0 " + (this.props.error ? "border-danger" : "border-white")
          }
        >
          <div className={this.props.error ? "bg-danger" : "bg-white pr-0"}>
            <span className={this.props.error ? "float-left" : "float-right"}>
              <button
                type="button"
                className={
                  "pr-0 " + (this.props.error ? "btn disabled" : "btn btn-link")
                }
                onClick={this.onClick}
              >
                {t("Forgot Password")}
              </button>
            </span>
          </div>
          <div
            className={
              "card-body bg-white " +
              (this.isExpanded() ? "" : " collapse ") +
              (this.props.error ? "p12" : "p-0")
            }
          >
            {t("forgot_password_description")}
            <pre>
              <code>sudo pihole -a -p</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("login")(ForgotPassword);
