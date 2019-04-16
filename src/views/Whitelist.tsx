/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Whitelist page
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { FunctionComponent } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import ListPage from "../components/list/ListPage";
import api from "../util/api";
import { isValidHostname } from "../util/validate";

const Whitelist: FunctionComponent<WithNamespaces> = props => {
  const { t } = props;

  return (
    <ListPage
      title={t("Whitelist")}
      placeholder={t("Add a domain or hostname (example.com or example)")}
      onAdd={api.addWhitelist}
      onRemove={api.removeWhitelist}
      onRefresh={api.getWhitelist}
      isValid={isValidHostname}
      validationErrorMsg={t("Not a valid hostname")}
      {...props}
    />
  );
};

export default withNamespaces(["location", "lists"])(Whitelist);
