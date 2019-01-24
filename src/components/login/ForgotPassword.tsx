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
import { WithNamespaces, withNamespaces } from "react-i18next";

export interface ForgotPasswordProps extends WithNamespaces {
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
      <div style={{ width: "100%" }}>
        <div
          className={
            "card " + (this.props.error ? "border-danger" : "border-primary")
          }
        >
          <div
            className={
              "card-header " + (this.props.error ? "bg-danger" : "bg-primary")
            }
            style={{ paddingRight: "10px" }}
          >
            <h3
              className="card-title"
              style={{ fontSize: "18px", display: "inline-block", margin: 0 }}
            >
              {t("Forgot Password")}
            </h3>

            <span className="pull-right">
              <button
                type="button"
                className="btn btn-card-tool"
                onClick={this.onClick}
              >
                <i
                  className={
                    "fa " + (this.isExpanded() ? "fa-minus" : "fa-plus")
                  }
                />
              </button>
            </span>
          </div>
          <div
            className={
              "card-body bg-light" + (this.isExpanded() ? "" : " collapse")
            }
            style={{ padding: "10px" }}
          >
            {t("forgot_password_description")}
            <pre style={{ textAlign: "center" }}>sudo pihole -a -p</pre>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces("login")(ForgotPassword);
