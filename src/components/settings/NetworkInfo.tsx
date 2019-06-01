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
import { Col, Form, FormGroup, Input, Label } from "reactstrap";
import { WithAPIData } from "../common/WithAPIData";

export interface NetworkInfoProps extends WithTranslation {
  interface: string;
  ipv4Address: string;
  ipv6Address: string;
  hostname: string;
}

class NetworkInfo extends Component<NetworkInfoProps, {}> {
  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup row>
          <Label className="bold" for="interface" sm={4}>
            {t("Interface")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="interface"
              value={this.props.interface}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv4_address" sm={4}>
            {t("IPv4 address")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="ipv4_address"
              value={this.props.ipv4Address}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="ipv6_address" sm={4}>
            {t("IPv6 address")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="ipv6_address"
              value={this.props.ipv6Address}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="hostname" sm={4}>
            {t("Hostname")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="hostname"
              value={this.props.hostname}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export const transformData = (
  data: ApiNetworkSettings
): Omit<NetworkInfoProps, keyof WithTranslation> => ({
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

export const TranslatedNetworkInfo = withTranslation(["common", "settings"])(
  NetworkInfo
);

export default (props: any) => (
  <WithAPIData
    apiCall={api.getNetworkInfo}
    repeatOptions={{
      interval: 600000,
      ignoreCancel: true
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
