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
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import api from "../../util/api";
import { WithAPIData } from "./WithAPIData";

class StatusBadge extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired
  };

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

export const TranslatedStatusBadge = translate("common")(StatusBadge);

export default props => (
  <WithAPIData
    apiCall={api.getStatus}
    repeatOptions={{ interval: 5000 }}
    renderInitial={() => <TranslatedStatusBadge status="loading" {...props} />}
    renderOk={data => <TranslatedStatusBadge status={data.status} {...props} />}
    renderErr={() => <TranslatedStatusBadge status="unknown" {...props} />}
  />
);
