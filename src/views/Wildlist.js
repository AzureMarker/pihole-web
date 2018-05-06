/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Wildlist page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import ListPage from "../components/ListPage";
import { api } from "../utils";

const Wildlist = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Wildcard")})`}
      note={(
        <p>
          {t("Note: Only the domain and subdomains of the blocked domain will be blocked.")}
        </p>
      )}
      add={api.addWildlist}
      remove={api.removeWildlist}
      refresh={api.getWildlist}
      {...props}
    />
  );
};

export default translate(["location", "lists"])(Wildlist);
