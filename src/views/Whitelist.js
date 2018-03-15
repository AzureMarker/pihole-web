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
import ListPage from "../components/ListPage";
import { api } from "../utils";

export default props => (
  <ListPage
    title="Whitelist"
    note={<p>Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.</p>}
    add={api.addWhitelist}
    remove={api.removeWhitelist}
    refresh={api.getWhitelist}
    {...props}/>
);
