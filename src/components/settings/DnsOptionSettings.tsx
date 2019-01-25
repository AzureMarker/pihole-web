/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: DNS :: DNS Options
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col, FormGroup, Input, Label } from "reactstrap";
import i18next from "i18next";

export interface DnsOptionsObject {
  fqdnRequired: boolean;
  bogusPriv: boolean;
  dnssec: boolean;
  listeningType: string;
}

export interface DnsOptionSettingsProps {
  settings: DnsOptionsObject;
  onUpdate: (settings: DnsOptionsObject) => void;
  t: i18next.TranslationFunction;
}

const DnsOptionSettings = ({
  settings,
  onUpdate,
  t
}: DnsOptionSettingsProps) => (
  <Fragment>
    <FormGroup row>
      <Label for="listeningBehavior" sm={5}>
        {t("Interface listening behavior")}
      </Label>
      <Col sm={7}>
        <Input
          id="listeningBehavior"
          type="select"
          value={settings.listeningType}
          onChange={e =>
            onUpdate({ ...settings, listeningType: e.target.value })
          }
        >
          <option>all</option>
          <option>local</option>
          <option>single</option>
        </Input>
      </Col>
    </FormGroup>
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          checked={settings.fqdnRequired}
          onChange={e =>
            onUpdate({ ...settings, fqdnRequired: e.target.checked })
          }
        />
        {t("Forward FQDNs only")}
      </Label>
    </FormGroup>
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          checked={settings.bogusPriv}
          onChange={e => onUpdate({ ...settings, bogusPriv: e.target.checked })}
        />
        {t("Only forward public reverse lookups")}
      </Label>
    </FormGroup>
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          checked={settings.dnssec}
          onChange={e => onUpdate({ ...settings, dnssec: e.target.checked })}
        />
        {t("Use DNSSEC")}
      </Label>
    </FormGroup>
  </Fragment>
);

DnsOptionSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default DnsOptionSettings;
