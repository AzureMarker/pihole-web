/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Status badge component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import { StatusContext } from "./context";

export interface StatusBadgeProps extends WithNamespaces {
  status: string;
}

class StatusBadge extends Component<StatusBadgeProps, {}> {
  isEnabled = () => this.props.status === "enabled";

  render() {
    const { t } = this.props;

    return (
      <span>
        <i
          className={
            "fa fa-circle text-" + (this.isEnabled() ? "success" : "danger")
          }
        />
        &nbsp;
        {t(this.isEnabled() ? "Enabled" : "Disabled")}
      </span>
    );
  }
}

export const TranslatedStatusBadge = withNamespaces("common")(StatusBadge);

export default () => (
  <StatusContext.Consumer>
    {({ status }) => <TranslatedStatusBadge status={status} />}
  </StatusContext.Consumer>
);
