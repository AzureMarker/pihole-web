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
import { ignoreCancel, makeCancelable } from "../../util";
import api from "../../util/api";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";

class NetworkInfo extends Component {
  state = {
    interface: "",
    ipv4_address: "",
    ipv6_address: "",
    hostname: ""
  };

  constructor(props) {
    super(props);
    this.updateNetInfo = this.updateNetInfo.bind(this);
  }

  updateNetInfo() {
    this.updateHandler = makeCancelable(api.getNetworkInfo(), {
      repeat: this.updateNetInfo,
      interval: 600000
    });
    this.updateHandler.promise
      .then(res => {
        this.setState({
          interface: res.interface,
          ipv4_address: res.ipv4_address,
          ipv6_address: res.ipv6_address,
          hostname: res.hostname
        });
      })
      .catch(ignoreCancel);
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
      <Form>
        <FormGroup row>
          <Label className="bold" for="interface" sm={4}>
            {t("Interface")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="interface">
              {this.state.interface}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv4_address" sm={4}>
            {t("IPv4 address")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="ipv4_address">
              {this.state.ipv4_address}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv6_address" sm={4}>
            {t("IPv6 address")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="ipv6_address">
              {this.state.ipv6_address}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="hostname" sm={4}>
            {t("Hostname")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="hostname">
              {this.state.hostname}
            </Input>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default translate(["common", "settings"])(NetworkInfo);
