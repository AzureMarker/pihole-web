/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Starting point for React
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "ionicons/dist/css/ionicons.min.css";
import "font-awesome/css/font-awesome.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "./scss/style.css";
import Full from "./containers/Full";
import api from "./util/api";
import { setupI18n } from "./i18n";

// Before rendering anything, check if there is a session cookie.
// Note: the user could have an old session, so the first API call
// will set loggedIn to false if necessary
api.loggedIn = document.cookie.includes("user_id=");

setupI18n();

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" name="Home" component={Full} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
