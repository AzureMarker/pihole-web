/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: DNS :: Upstream DNS Servers
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Col, FormGroup, Input, Label } from "reactstrap";

const ConditionalForwardingSettings = ({
  settings,
  onUpdate,
  isRouterIpValid,
  isDomainValid,
  t
}) => (
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
          value={settings.routerIp}
          onChange={e => onUpdate({ ...settings, routerIp: e.target.value })}
          invalid={!isRouterIpValid}
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

ConditionalForwardingSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isRouterIpValid: PropTypes.bool.isRequired,
  isDomainValid: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default ConditionalForwardingSettings;
