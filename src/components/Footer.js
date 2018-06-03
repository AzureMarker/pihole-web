/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Footer component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from "react-i18next";

const Footer = props => {
  const { t } = props;

  return (
    <footer className="app-footer">
      <div className="pull-right">
        <b className="hidden-xs-down">{t("Core Version")}: </b>
        <b className="hidden-sm-up">C: </b> <span id="piholeVersion">vDev</span>
        <b className="hidden-xs-down">, {t("Web Version")}: </b>
        <b className="hidden-sm-up">, W: </b> <span id="webVersion">vDev</span>
      </div>
      <div>
        <i className="fa fa-paypal"/>
        <strong>
          <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=3J2L3Z4DHW9UY">
            &nbsp;{t("Donate")}
          </a>
        </strong> {t("if you found this useful")}
      </div>
    </footer>
  );
};

export default translate(["common", "footer"])(Footer);
