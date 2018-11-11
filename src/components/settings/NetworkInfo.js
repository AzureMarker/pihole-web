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
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import api from "../../util/api";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";
import { WithAPIData } from "../common/WithAPIData";

class NetworkInfo extends Component {
  static propTypes = {
    interface: PropTypes.string.isRequired,
    ipv4Address: PropTypes.string.isRequired,
    ipv6Address: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired
  };

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
              {this.props.interface}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv4_address" sm={4}>
            {t("IPv4 address")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="ipv4_address">
              {this.props.ipv4Address}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv6_address" sm={4}>
            {t("IPv6 address")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="ipv6_address">
              {this.props.ipv6Address}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="hostname" sm={4}>
            {t("Hostname")}
          </Label>
          <Col sm={8}>
            <Input plaintext id="hostname">
              {this.props.hostname}
            </Input>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export const transformData = data => ({
  interface: data.interface,
  ipv4Address: data.ipv4_address,
  ipv6Address: data.ipv6_address,
  hostname: data.hostname
});

export const initialData = () => ({
  interface: "",
  ipv4Address: "",
  ipv6Address: "",
  hostname: ""
});

export const TranslatedNetworkInfo = translate(["common", "settings"])(
  NetworkInfo
);

export default props => (
  <WithAPIData
    apiCall={api.getNetworkInfo}
    repeatOptions={{
      interval: 600000
    }}
    renderInitial={() => (
      <TranslatedNetworkInfo {...initialData()} {...props} />
    )}
    renderOk={data => (
      <TranslatedNetworkInfo {...transformData(data)} {...props} />
    )}
    renderErr={() => <TranslatedNetworkInfo {...initialData()} {...props} />}
  />
);
