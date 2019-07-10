/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Starting point for React
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "ionicons/dist/css/ionicons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./scss/style.css";
import Full from "./containers/Full";
import api from "./util/api";
import { setupI18n } from "./util/i18n";
import { getBasePath } from "./util/basePath";

// Before rendering anything, check if there is a session cookie.
// Note: the user could have an old session, so the first API call
// will set loggedIn to false if necessary
api.loggedIn = document.cookie.includes("user_id=");

// Verify the loggedIn status with the server. If we thought we were logged out
// but the API does not require authentication, refresh the page so we start
// in logged-in mode.
//
// An alternative to refreshing the page is to provide the loggedIn status via
// React context or some other mechanism. With the current infrastructure of
// the web interface, it is very messy to use React context for this as
// `api.loggedIn` is used in a few hard to reach spots. We should look into
// Redux for a cleaner approach.
api.checkAuthStatus().then(() => {
  if (!api.loggedIn) {
    // No authentication is required for this API. Refresh the page so we start
    // in logged-in mode
    window.location.reload();
  }
});

setupI18n();

ReactDOM.render(
  <BrowserRouter basename={getBasePath()}>
    <Switch>
      <Route path="/" name="Home" component={Full} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
