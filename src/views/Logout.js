/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Logout the user
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import api from "../util/api";
import config from "../config";

export default class Logout extends Component {
  componentWillMount() {
    api.loggedIn = false;

    if (config.fakeAPI) {
      // When using the fake API, don't try deleting the resource
      // (it results in an error). Instead, delete the cookie.
      document.cookie =
        "user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    } else {
      api.logout();
    }
  }

  render() {
    return <Redirect to="/" />;
  }
}
