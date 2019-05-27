/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Regexlist page
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { FunctionComponent } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import ListPage from "../components/list/ListPage";
import api from "../util/api";
import { isValidRegex } from "../util/validate";

const Regexlist: FunctionComponent<WithNamespaces> = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Regex")})`}
      placeholder={t("Input a regular expression")}
      onAdd={api.addRegexlist}
      onRemove={api.removeRegexlist}
      onRefresh={api.getRegexlist}
      isValid={isValidRegex}
      validationErrorMsg={t("Not a valid regular expression")}
      {...props}
    />
  );
};

export default withNamespaces(["location", "lists"])(Regexlist);
