/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: Network component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { translate } from "react-i18next";
import { api, ignoreCancel, makeCancelable } from "../../utils";

class NetworkInfo extends Component {
  state = {
    interface: "---",
    ipv4_address: "---",
    ipv6_address: "---",
    hostname: "---"
  };

  constructor(props) {
    super(props);
    this.updateNetInfo = this.updateNetInfo.bind(this);
  }

  updateNetInfo() {
    this.updateHandler = makeCancelable(api.getNetworkInfo(), { repeat: this.updateNetInfo, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        interface: res.interface,
        ipv4_address: res.ipv4_address,
        ipv6_address: res.ipv6_address,
        hostname: res.hostname
      });
    })
      .catch(ignoreCancel)
      .catch(() => {
        this.setState({
          interface: "-!-",
          ipv4_address: "-!-",
          ipv6_address: "-!-",
          hostname: "-!-"
        });
      });
  }

  componentDidMount() {
    this.updateNetInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="card border-0 bg-success stat-dbl-height-lock">
        <div className="card-block">
          <div className="card-icon">
            <i className="fa fa-sitemap fa-2x"/>
          </div>
        </div>
        <div className="card-img-overlay">
          <h3>{t("Network")}</h3>
          <pre>
            {t("Interface")}: {this.state.interface}<br/>
            {t("IPv4 address")}: {this.state.ipv4_address}<br/>
            {t("IPv6 address")}: {this.state.ipv6_address}<br/>
            {t("Hostname")}: {this.state.hostname}
          </pre>
        </div>
      </div>
    );
  }
}

export default translate(["common", "settings"])(NetworkInfo);
