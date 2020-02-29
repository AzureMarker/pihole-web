/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Starting point for React
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./scss/style.scss";
import Full from "./containers/Full";
import api from "./util/api";
import { setupI18n } from "./util/i18n";
import { getBasePath } from "./util/basePath";
import store from "./redux/store";
import { Provider } from "react-redux";

// Before rendering anything, check if there is a session cookie.
// Note: the user could have an old session, so the first API call
// will set loggedIn to false if necessary
api.loggedIn = document.cookie.includes("user_id=");

setupI18n();
store.runSaga();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={getBasePath()}>
      <Switch>
        <Route path="/" name="Home" component={Full} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
