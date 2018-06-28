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
import NetworkInfo from '../components/NetworkInfo';
import FTLInfo from '../components/FTLInfo';

export default () => (
  <div className="animated fadeIn">
    <div className="container-flex">
      <VersionInfo/>
    </div>
    <div className="container-flex">
      <div className="row">
        <div className="col-lg-3 col-xs-12">
          <NetworkInfo/>
        </div>
        <div className="col-lg-3 col-xs-12">
          <FTLInfo/>
        </div>
      </div>
    </div>
  </div>
);

