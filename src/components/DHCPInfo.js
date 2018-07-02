/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: DHCP 
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component} from 'react';
import { translate } from 'react-i18next';
import { api, makeCancelable } from '../utils';

class DHCPInfo extends Component {
  state = {
    active: "---",
    ip_start: "---",
    ip_end: "---",
    router_ip: "---",
    lease_time: "---",
    domain: "---",
    ipv6_support: "---"
  }

  constructor(props) {
    super(props);
    this.updateDHCPInfo = this.updateDHCPInfo.bind(this);
  }

  updateDHCPInfo() {
    this.updateHandler = makeCancelable(api.getDHCPInfo(), { repeat: this.updateDHCPInfo, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        active: res.active,
        ip_start: res.ip_start,
        ip_end: res.ip_end,
        router_ip: res.router_ip,
        lease_time: res.lease_time,
        domain: res.domain,
        ipv6_support: res.ipv6_support
      }) 
    })
      .catch((err) => {
        if(!err.isCanceled) {
          this.setState({
            active: "-!-",
            ip_start: "-!-",
            ip_end: "-!-",
            router_ip: "-!-",
            lease_time: "-!-",
            domain: "-!-",
            ipv6_support: "-!-"
          });
        }
      }
    );
  }

  componentDidMount() {
    this.updateDHCPInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="card border-0 bg-success stat-dbl-height-lock">
        <div className="card-body">
          <div className="card-icon">
            <i className="fa fa-cogs fa-2x"/>
          </div>
        </div>
        <div className="card-img-overlay">
          <h3>{t("DHCP Information")}</h3>
          <pre>
            {t("DHCP Active")}:    {this.state.active.toString()}<br/>
            {t("Start IP")}:       {this.state.ip_start}<br/>
            {t("End IP")}:         {this.state.ip_end}<br/>
            {t("Router IP")}:      {this.state.router_ip}<br/>
            {t("Lease Time")}:     {this.state.lease_time} h<br/>
            {t("Domain")}:         {this.state.domain}<br/>
            {t("IPv6 Supported")}: {this.state.ipv6_support.toString()}<br/>
          </pre>
        </div>
      </div>
    );
  }
}

export default translate(['settings'])(DHCPInfo);
