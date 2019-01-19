/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Whitelist page
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { withNamespaces } from "react-i18next";
import ListPage from "../components/list/ListPage";
import api from "../util/api";
import { isValidDomain } from "../util/validate";

const Whitelist = props => {
  const { t } = props;

  return (
    <ListPage
      title={t("Whitelist")}
      placeholder={t("Add a domain (example.com or sub.example.com)")}
      add={api.addWhitelist}
      remove={api.removeWhitelist}
      refresh={api.getWhitelist}
      isValid={isValidDomain}
      validationErrorMsg={t("Not a valid domain")}
      {...props}
    />
  );
};

export default withNamespaces(["location", "lists"])(Whitelist);
