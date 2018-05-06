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
      note={
        <div>
        <p>{t("Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.")}</p>
        <p>
          Some of the domains shown below are the ad list domains, which are automatically added in order to prevent
          ad lists being able to blacklist each other.
          See <a href="https://github.com/pi-hole/pi-hole/blob/master/adlists.default" target="_blank" rel="noopener noreferrer">here</a> for
          the default set of ad lists.
        </p>
        </div>
      }
      add={api.addWhitelist}
      remove={api.removeWhitelist}
      refresh={api.getWhitelist}
      {...props}
    />
  )
};

export default translate(["location", "lists"])(Whitelist);