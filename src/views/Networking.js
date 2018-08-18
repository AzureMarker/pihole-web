/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings Page - Networking DNS & DHCP
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { translate } from "react-i18next";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import DHCPInfo from "../components/settings/DHCPInfo";
import DNSInfo from "../components/settings/DNSInfo";
import NetworkInfo from "../components/settings/NetworkInfo";
import FTLInfo from "../components/settings/FTLInfo";

class Networking extends Component {
  state = {
    activeTab: "network"
  };

  /**
   * Set the active tab to the input
   *
   * @param tab the tab ID to switch to
   */
  setTab = tab => {
    if(this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  /**
   * Create a navigation tab
   *
   * @param id the tab's ID
   * @param name the tab's display name
   * @returns {NavItem} the tab component
   */
  tab = (id, name) => (
    <NavItem>
      <NavLink active={this.state.activeTab === id} onClick={() => this.setTab(id)}>
        {name}
      </NavLink>
    </NavItem>
  );

  /**
   * Create tab content
   *
   * @param id the tab's ID
   * @param component the component to render in the tab
   * @returns {TabPane} the tab content component
   */
  tabContent = (id, component) => (
    <TabPane tabId={id}>{component}</TabPane>
  );

  render() {
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <Nav tabs>
          {this.tab("network", t("Network"))}
          {this.tab("dhcp", t("DHCP"))}
          {this.tab("dns", t("DNS"))}
          {this.tab("ftl", t("FTL"))}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.tabContent("network", <NetworkInfo/>)}
          {this.tabContent("dhcp", <DHCPInfo/>)}
          {this.tabContent("dns", <DNSInfo/>)}
          {this.tabContent("ftl", <FTLInfo/>)}
        </TabContent>
      </div>
    );
  }
}

export default translate(["common", "settings"])(Networking);
