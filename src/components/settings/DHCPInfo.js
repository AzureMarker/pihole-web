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
import { ignoreCancel, makeCancelable } from "../../util";
import api from "../../util/api";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label
} from "reactstrap";
import { isPositiveNumber, isValidHostname, isValidIpv4 } from "../../validate";

class DHCPInfo extends Component {
  state = {
    active: false,
    ip_start: "",
    ip_end: "",
    router_ip: "",
    lease_time: "",
    domain: "",
    ipv6_support: false
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
      .catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateDHCPInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  /**
   * Create a function which will update the key in the state with the value
   * of the event attribute.
   *
   * @param key {string} the state to update
   * @param attr {string} the event target attribute to use
   * @returns {function(Event)}
   */
  onChange = (key, attr) => {
    return e =>
      this.setState({
        [key]: e.target[attr]
      });
  };

  /**
   * Save changes to DHCP settings
   *
   * @param e the submit event
   */
  saveSettings = e => {
    e.preventDefault();

    // TODO: send settings to API
  };

  /**
   * Settings are valid if the value is valid or if DHCP is disabled and the value is empty.
   *
   * @param value the value to check
   * @param validator the validation function
   */
  isSettingValid = (value, validator) => {
    return (!this.state.active && value.length === 0) || validator(value);
  };

  render() {
    const { t } = this.props;

    const isIpStartValid = this.isSettingValid(
      this.state.ip_start,
      isValidIpv4
    );
    const isIpEndValid = this.isSettingValid(this.state.ip_end, isValidIpv4);
    const isRouterIpValid = this.isSettingValid(
      this.state.router_ip,
      isValidIpv4
    );
    const isLeaseTimeValid = this.isSettingValid(
      this.state.lease_time,
      isPositiveNumber
    );
    const isDomainValid = this.isSettingValid(
      this.state.domain,
      isValidHostname
    );

    return (
      <Form onSubmit={this.saveSettings}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.active}
              onChange={this.onChange("active", "checked")}
            />
            {t("Enabled")}
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
              invalid={!isIpStartValid}
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
              invalid={!isIpEndValid}
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
              invalid={!isRouterIpValid}
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
                invalid={!isLeaseTimeValid}
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
              invalid={!isDomainValid}
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
        <Button
          type="submit"
          disabled={
            !isIpStartValid ||
            !isIpEndValid ||
            !isRouterIpValid ||
            !isLeaseTimeValid ||
            !isDomainValid
          }
        >
          {t("Apply")}
        </Button>
      </Form>
    );
  }
}

export default translate(["common", "settings"])(DHCPInfo);
