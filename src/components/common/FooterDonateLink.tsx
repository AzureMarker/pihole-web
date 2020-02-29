/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Footer Donate Link component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";

const FooterDonateLink = (props: any) => {
  const { t } = props;
  return (
    <a
      id="paypalDonation"
      href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=3J2L3Z4DHW9UY"
      target="_blank"
      rel="noopener noreferrer"
    >
      &nbsp;
      {t("Donate")}
    </a>
  );
};

export default FooterDonateLink;
