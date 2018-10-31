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
import {
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label
} from "reactstrap";

class DHCPInfo extends Component {
  state = {
    active: "---",
    ip_start: "---",
    ip_end: "---",
    router_ip: "---",
    lease_time: "---",
    domain: "---",
    ipv6_support: "---"
  };

  constructor(props) {
    super(props);
    this.updateDHCPInfo = this.updateDHCPInfo.bind(this);
  }

  updateDHCPInfo() {
    this.updateHandler = makeCancelable(api.getDHCPInfo(), {
      repeat: this.updateDHCPInfo,
      interval: 600000
    });
    this.updateHandler.promise
      .then(res => {
        this.setState({
          active: res.active,
          ip_start: res.ip_start,
          ip_end: res.ip_end,
          router_ip: res.router_ip,
          lease_time: res.lease_time,
          domain: res.domain,
          ipv6_support: res.ipv6_support
        });
      })
      .catch(ignoreCancel)
      .catch(() => {
        this.setState({
          active: "-!-",
          ip_start: "-!-",
          ip_end: "-!-",
          router_ip: "-!-",
          lease_time: "-!-",
          domain: "-!-",
          ipv6_support: "-!-"
        });
      });
  }

  componentDidMount() {
    this.updateDHCPInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  onChange = (key, attr) => {
    return e =>
      this.setState({
        [key]: e.target[attr]
      });
  };

  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup check style={{ paddingBottom: "10px" }}>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.active}
              onChange={this.onChange("active", "checked")}
            />
            Enabled
          </Label>
        </FormGroup>
        <FormGroup row>
          <Label for="startIP" sm={2}>
            {t("Start IP")}
          </Label>
          <Col sm={10}>
            <Input
              id="startIP"
              disabled={!this.state.active}
              value={this.state.ip_start}
              onChange={this.onChange("ip_start", "value")}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="endIP" sm={2}>
            {t("End IP")}
          </Label>
          <Col sm={10}>
            <Input
              id="endIP"
              disabled={!this.state.active}
              value={this.state.ip_end}
              onChange={this.onChange("ip_end", "value")}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="routerIP" sm={2}>
            {t("Router IP")}
          </Label>
          <Col sm={10}>
            <Input
              id="routerIP"
              disabled={!this.state.active}
              value={this.state.router_ip}
              onChange={this.onChange("router_ip", "value")}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="leaseTime" sm={2}>
            {t("Lease Time")}
          </Label>
          <Col sm={10}>
            <InputGroup>
              <Input
                id="leaseTime"
                disabled={!this.state.active}
                value={this.state.lease_time}
                onChange={this.onChange("lease_time", "value")}
              />
              <InputGroupAddon addonType={"append"}>Hours</InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="domain" sm={2}>
            {t("Domain")}
          </Label>
          <Col sm={10}>
            <Input
              id="domain"
              disabled={!this.state.active}
              value={this.state.domain}
              onChange={this.onChange("domain", "value")}
            />
          </Col>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              disabled={!this.state.active}
              checked={this.state.ipv6_support}
              onChange={this.onChange("ipv6_support", "checked")}
            />
            {t("IPv6 Support")}
          </Label>
        </FormGroup>
      </Form>
    );
  }
}

export default translate(["common", "settings"])(DHCPInfo);
