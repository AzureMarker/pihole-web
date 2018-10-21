/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Blacklist page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import { api } from "../utils";
import ListPage from "../components/list/ListPage";
import { isValidDomain } from "../validate";

const Blacklist = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Exact")})`}
      placeholder={t("Add a domain (example.com or sub.example.com)")}
      add={api.addBlacklist}
      remove={api.removeBlacklist}
      refresh={api.getBlacklist}
      isValid={isValidDomain}
      validationErrorMsg={t("Not a valid domain")}
      {...props}
    />
  )
};

export default translate("location")(Blacklist);
