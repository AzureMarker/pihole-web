/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Logout the user
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import { Component } from 'react';
import { api } from "../utils";

export default class Logout extends Component {
  componentWillMount() {
    // TODO: remove auth cookie
    api.loggedIn = false;
    api.logout();
    this.props.history.push('/');
  }

  render() {
    return null;
  }
}
