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
import ListPage from "../components/ListPage";

const Blacklist = props => {
  const { t } = props;

  return (
    <ListPage
      title={`${t("Blacklist")} (${t("Exact")})`}
      add={api.addBlacklist}
      remove={api.removeBlacklist}
      refresh={api.getBlacklist}
      {...props}
    />
  )
};

export default translate("location")(Blacklist);
