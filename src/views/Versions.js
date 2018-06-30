/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: Information Page - Software versions, Network & FTL Database
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import VersionInfo from '../components/VersionInfo';


export default () => (
  <div className="animated fadeIn">
    <div className="container-flex">
      <VersionInfo/>
    </div>
  </div>
);

