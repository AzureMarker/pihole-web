/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Wildlist page
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import ListPage from "../components/ListPage";
import { api } from "../utils";

export default props => (
  <ListPage
    title="Blacklist (Wildcard)"
    note={(
      <p>
        Note: Only the domain and subdomains of the blocked domain will be blocked.
        You can not block in the regex sense.
      </p>
    )}
    add={api.addWildlist}
    remove={api.removeWildlist}
    refresh={api.getWildlist}
    {...props}/>
);
