/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings Page - Networking DNS & DHCP
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';

import DHCPInfo from '../components/DHCPInfo';
import DNSInfo from '../components/DNSInfo';
import NetworkInfo from '../components/NetworkInfo';
import FTLInfo from '../components/FTLInfo';

export default () => (
  <div className="animated fadeIn">
    <div className="container-flex">
      <div className="row">
        <div className="col-lg-6 col-xs-6">
          <NetworkInfo/>
        </div>
        <div className="col-lg-6 col-xs-6">
          <DHCPInfo/>
        </div>
        <div className="col-lg-12 col-xs-12">
          <DNSInfo/>
        </div>
        <div className="col-lg-3 col-xs-3">
          <FTLInfo/>
        </div>
      </div>
    </div>
  </div>
);
