/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Footer component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Suspense } from "react";
import { withTranslation } from "react-i18next";
import FooterUpdateStatus from "./FooterUpdateStatus";
import FooterDonateLink from "./FooterDonateLink";

const Footer = (props: any) => {
  const { t } = props;

  return (
    <footer className="c-footer">
      <div>
        <i className="fab fa-paypal" />
        <strong>
          <FooterDonateLink t={t} />
        </strong>{" "}
        {t("if you found this useful")}
      </div>
      <FooterUpdateStatus {...props} />
    </footer>
  );
};

const TranslatedFooter = withTranslation(["common", "footer"])(Footer);

export default () => (
  <Suspense fallback={null}>
    <TranslatedFooter />
  </Suspense>
);
