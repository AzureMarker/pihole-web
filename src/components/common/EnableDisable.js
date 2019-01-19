/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * The enable/disable sidebar button
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import NavButton from "./NavButton";
import NavDropdown from "./NavDropdown";
import { StatusContext } from "./context";
import { makeCancelable } from "../../util";
import api from "../../util/api";

class EnableDisable extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired
  };

  state = {
    processing: false
  };

  setStatus = (action, time = null) => {
    if (this.state.processing) {
      // Wait for the first status change to go through
      return;
    }

    // Only allow one status update at a time
    this.setState({ processing: true });

    // Send the status change request
    this.updateHandler = makeCancelable(api.setStatus(action, time));
    this.updateHandler.promise
      // Refresh once we get a good response
      .then(() => this.props.refresh())
      // Even if it failed, allow new status changes
      .finally(() => this.setState({ processing: false }));
  };

  componentWillUnmount() {
    if (this.updateHandler) {
      this.updateHandler.cancel();
    }
  }

  render() {
    const { t, status } = this.props;

    switch (status) {
      case "enabled":
        return (
          <NavDropdown name={t("Disable")} icon="fa fa-stop" isOpen={false}>
            <NavButton
              name={t("Permanently")}
              icon="fa fa-stop"
              onClick={() => this.setStatus("disable")}
            />
            <NavButton
              name={t("For {{time}} seconds", { time: 10 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 10)}
            />
            <NavButton
              name={t("For {{time}} seconds", { time: 30 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 30)}
            />
            <NavButton
              name={t("For {{time}} minutes", { time: 5 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 5 * 60)}
            />
            {/* TODO: Implement custom time input */}
            <NavButton name={t("Custom time")} icon="fa fa-clock" />
          </NavDropdown>
        );
      case "disabled":
        return (
          <NavButton
            name={t("Enable")}
            icon="fa fa-play"
            onClick={() => this.setStatus("enable")}
          />
        );
      case "unknown":
      default:
        return null;
    }
  }
}

export const TranslatedEnableDisable = withNamespaces("common")(EnableDisable);

export default () => (
  <StatusContext.Consumer>
    {({ status, refresh }) => (
      <TranslatedEnableDisable status={status} refresh={refresh} />
    )}
  </StatusContext.Consumer>
);
