/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Footer component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import FooterUpdateStatus from "./FooterUpdateStatus";

const Footer = props => {
  const { t } = props;

  return (
    <footer className="app-footer">
      <div>
        <i className="fa fa-paypal" />
        <strong>
          <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=3J2L3Z4DHW9UY">
            &nbsp;
            {t("Donate")}
          </a>
        </strong>{" "}
        {t("if you found this useful")}
      </div>
      <FooterUpdateStatus {...props} />
    </footer>
  );
};

export default translate(["common", "footer"])(Footer);
