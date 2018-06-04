/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Whitelist page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import ListPage from "../components/ListPage";
import { api } from "../utils";

const Whitelist = props => {
  const { t } = props;

  return (
    <ListPage
      title={t("Whitelist")}
      note={<p>{t("Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.")}</p>}
      placeholder={t("Add a domain (example.com or sub.example.com)")}
      add={api.addWhitelist}
      remove={api.removeWhitelist}
      refresh={api.getWhitelist}
      {...props}
    />
  )
};

export default translate(["location", "lists"])(Whitelist);