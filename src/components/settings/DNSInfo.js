/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: DHCP
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { translate } from "react-i18next";
import { api, ignoreCancel, makeCancelable } from "../../utils";

class DNSInfo extends Component {
  state = {
    "upstream_dns": ["---"],
    "conditional_forwarding": {
      "enabled": "---",
      "router_ip": "---",
      "domain": "---"
    },
    "options": {
      "fqdn_required": "---",
      "bogus_priv": "---",
      "dnssec": "---",
      "listening_type": "---"
    }
  };

  constructor(props) {
    super(props);
    this.updateDNSInfo = this.updateDNSInfo.bind(this);
  }

  updateDNSInfo() {
    this.updateHandler = makeCancelable(api.getDNSInfo(), { repeat: this.updateDNSInfo, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState(res);
    })
      .catch(ignoreCancel)
      .catch(() => {
        this.setState({
          "upstream_dns": ["-!-"],
          "options": {
            "fqdn_required": "-!-",
            "bogus_priv": "-!-",
            "dnssec": "-!-",
            "listening_type": "-!-"
          },
          "conditional_forwarding": {
            "enabled": "-!-",
            "router_ip": "-!-",
            "domain": "-!-"
          }
        });
      });
  }

  componentDidMount() {
    this.updateDNSInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="row">
        <div className="col-lg-4 col-sm-4 col-xs-4">
          <pre>
            <br/>
            {t("Upstream DNS Servers")}:<br/>
            {this.state.upstream_dns.map(item => item + "\n")}<br/>
          </pre>
        </div>
        <div className="col-lg-4 col-sm-4 col-xs-4">
          <pre>
            <br/>
            {t("Interface listening behavior")}: {this.state.options.listening_type}<br/>
            {t("Forward FQDNs only")}: {this.state.options.fqdn_required.toString()}<br/>
            {t("Only forward public reverse lookups")}:{this.state.options.bogus_priv.toString()}<br/>
            {t("Use DNSSEC")}: {this.state.options.dnssec.toString()}
          </pre>
        </div>
        <div className="col-lg-4 col-sm-4 col-xs-4">
          <pre>
            <br/>
            {t("Conditional Forwarding")}<br/>
            {t("Enabled")}: {this.state.conditional_forwarding.enabled.toString()}<br/>
            {t("Router IP")}: {this.state.conditional_forwarding.router_ip.toString()}<br/>
            {t("Local Domain Name")}: {this.state.conditional_forwarding.domain.toString()}<br/>
          </pre>
        </div>
      </div>
    );
  }
}

export default translate(["common", "settings"])(DNSInfo);
