/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: Network component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";

export interface NetworkInfoState {
  interface: string;
  ipv4Address: string;
  ipv6Address: string;
  hostname: string;
}

class NetworkInfo extends Component<WithTranslation, NetworkInfoState> {
  state: NetworkInfoState = {
    interface: "",
    ipv4Address: "",
    ipv6Address: "",
    hostname: ""
  };

  private loadHandler: undefined | CancelablePromise<ApiNetworkSettings>;

  loadNetworkInfo = () => {
    this.loadHandler = makeCancelable(api.getNetworkInfo());
    this.loadHandler.promise
      .then(res => {
        this.setState({
          interface: res.interface,
          ipv4Address: res.ipv4_address,
          ipv6Address: res.ipv6_address,
          hostname: res.hostname
        });
      })
      .catch(ignoreCancel);
  };

  componentDidMount() {
    this.loadNetworkInfo();
  }

  componentWillUnmount() {
    if (this.loadHandler) {
      this.loadHandler.cancel();
    }
  }

  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup row>
          <Label className="font-weight-bold" for="interface" sm={4}>
            {t("Interface")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="interface"
              value={this.state.interface}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="font-weight-bold" for="ipv4_address" sm={4}>
            {t("IPv4 address")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="ipv4_address"
              value={this.state.ipv4Address}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="font-weight-bold" for="ipv6_address" sm={4}>
            {t("IPv6 address")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="ipv6_address"
              value={this.state.ipv6Address}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="font-weight-bold" for="hostname" sm={4}>
            {t("Hostname")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="hostname"
              value={this.state.hostname}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default withTranslation(["common", "settings"])(NetworkInfo);
