/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Starting point for React
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import 'ionicons/dist/css/ionicons.min.css';
import Full from './containers/Full'
import { setupI18n } from './i18n';

setupI18n();

ReactDOM.render(
  (
    <HashRouter>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </HashRouter>
  ),
  document.getElementById('root')
);
