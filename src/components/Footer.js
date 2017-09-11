/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Footer component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */


import React from 'react';

export default () => (
  <footer className="app-footer">
    <div className="pull-right">
      <b className="hidden-xs-down">Core Version: </b>
      <b className="hidden-sm-up">C: </b> <span id="piholeVersion">vDev</span>
      <b className="hidden-xs-down"> Admin Version: </b>
      <b className="hidden-sm-up"> A: </b> <span id="webVersion">vDev</span>
    </div>
    <div>
      <i className="fa fa-paypal"/>
      <strong>
        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=3J2L3Z4DHW9UY"> Donate</a>
      </strong> if you found this useful
    </div>
  </footer>
);
