/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Regexlist page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import ListPage from "../components/list/ListPage";
import { api } from "../utils";

const Regexlist = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Regex")})`}
      placeholder={t("Input a regular expression")}
      add={api.addRegexlist}
      remove={api.removeRegexlist}
      refresh={api.getRegexlist}
      {...props}
    />
  );
};

export default translate(["location", "lists"])(Regexlist);
