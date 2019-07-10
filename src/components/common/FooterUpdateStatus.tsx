/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * FooterUpdateStatus component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FooterUpdateStatus = ({
  updateAvailable = false,
  t
}: { updateAvailable: boolean } & WithTranslation) => {
  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="ml-auto">
      <Link to="/settings/versions">{t("Update Available")}</Link>
    </div>
  );
};

export default withTranslation("footer")(FooterUpdateStatus);
