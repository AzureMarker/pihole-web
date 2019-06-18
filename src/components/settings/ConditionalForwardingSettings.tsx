/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: DNS :: Upstream DNS Servers
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Fragment } from "react";
import { Col, FormGroup, Input, Label } from "reactstrap";
import i18next from "i18next";

export interface ConditionalForwardingObject {
  enabled: boolean;
  ip: string;
  domain: string;
  cidr: number;
}

export interface ConditionalForwardingSettingsProps {
  settings: ConditionalForwardingObject;
  onUpdate: (settings: ConditionalForwardingObject) => void;
  isRouterIpValid: boolean;
  isDomainValid: boolean;
  t: i18next.TFunction;
}

const ConditionalForwardingSettings = ({
  settings,
  onUpdate,
  isRouterIpValid,
  isDomainValid,
  t
}: ConditionalForwardingSettingsProps) => (
  <Fragment>
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          checked={settings.enabled}
          onChange={e => onUpdate({ ...settings, enabled: e.target.checked })}
        />
        {t("Enabled")}
      </Label>
    </FormGroup>
    <FormGroup row>
      <Label for="routerIP" sm={5}>
        {t("Router IP")}
      </Label>
      <Col sm={7}>
        <Input
          id="routerIP"
          disabled={!settings.enabled}
          value={settings.ip}
          onChange={e => onUpdate({ ...settings, ip: e.target.value })}
          invalid={!isRouterIpValid}
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="cidr" sm={5}>
        {t("Prefix length (CIDR)")}
      </Label>
      <Col sm={7}>
        <Input
          id="cidr"
          disabled={!settings.enabled}
          value={settings.cidr}
          onChange={e => {
            const cidr = parseInt(e.target.value);

            // Only allow numbers
            if (isNaN(cidr)) {
              return;
            }

            onUpdate({ ...settings, cidr });
          }}
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="localDomain" sm={5}>
        {t("Local Domain Name")}
      </Label>
      <Col sm={7}>
        <Input
          id="localDomain"
          disabled={!settings.enabled}
          value={settings.domain}
          onChange={e => onUpdate({ ...settings, domain: e.target.value })}
          invalid={!isDomainValid}
        />
      </Col>
    </FormGroup>
  </Fragment>
);

export default ConditionalForwardingSettings;
