/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings Information Page - DNS & DHCP
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';

import DHCPInfo from '../components/DHCPInfo';
import DNSInfo from '../components/DNSInfo';

export default () => (
  <div className="animated fadeIn">
    <div className="container-flex">
      <div className="row">
        <div className="col-lg-3 col-xs-12">
          <DHCPInfo/>
        </div>
        <div className="col-lg-8 col-xs-12">
          <DNSInfo/>
        </div>
      </div>
    </div>
  </div>
);

