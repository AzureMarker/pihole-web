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

class EnableDisable extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired
  };

  render() {
    const { t, status } = this.props;

    switch (status) {
      case "enabled":
        return (
          <NavDropdown name={t("Disable")} icon="fa fa-stop" isOpen={false}>
            <NavButton name={t("Permanently")} icon="fa fa-stop" />
            <NavButton
              name={t("For {{time}} seconds", { time: 10 })}
              icon="fa fa-clock"
            />
            <NavButton
              name={t("For {{time}} seconds", { time: 30 })}
              icon="fa fa-clock"
            />
            <NavButton
              name={t("For {{time}} minutes", { time: 5 })}
              icon="fa fa-clock"
            />
            <NavButton name={t("Custom time")} icon="fa fa-clock" />
          </NavDropdown>
        );
      case "disabled":
        return <NavButton name={t("Enable")} icon="fa fa-play" />;
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
