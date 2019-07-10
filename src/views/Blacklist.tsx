/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Blacklist page
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { FunctionComponent } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../util/api";
import ListPage from "../components/list/ListPage";
import { isValidHostname } from "../util/validate";

const Blacklist: FunctionComponent<WithTranslation> = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Exact")})`}
      placeholder={t("Add a domain or hostname (example.com or example)")}
      onAdd={api.addBlacklist}
      onRemove={api.removeBlacklist}
      onRefresh={api.getBlacklist}
      isValid={isValidHostname}
      validationErrorMsg={t("Not a valid hostname")}
      {...props}
    />
  );
};

export default withTranslation(["location", "lists"])(Blacklist);
