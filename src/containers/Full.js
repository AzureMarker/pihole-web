/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Main container of the web interface (performs main routing)
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Header, { mobileSidebarHide } from '../components/Header';
import Sidebar from '../components/Sidebar';
import Aside from '../components/Aside';
import Footer from '../components/Footer';
import Dashboard from '../views/Dashboard';
import QueryLog from '../components/QueryLog';
import Whitelist from "../views/Whitelist";
import Blacklist from "../views/Blacklist";
import Regexlist from "../views/Regexlist";
import Versions from "../views/Versions";
import Networking from "../views/Networking";
import Login from "../views/Login";
import Logout from "../views/Logout";
import { api } from "../utils";

export default props => (
  <div className="app">
    <Header/>
    <div className="app-body">
      <Sidebar {...props}/>
      <main className="main" onClick={mobileSidebarHide}>
        <div className="container-fluid" style={{"marginTop": "1.5rem"}}>
          <Switch>
            <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
            <Redirect exact from="/" to="/dashboard"/>
            <AuthRoute path="/query-log" name="Query Log" component={QueryLog}/>
            <Route path="/whitelist" name="Whitelist" component={Whitelist}/>
            <Route path="/blacklist" name="Blacklist" component={Blacklist}/>
            <Route path="/regexlist" name="Regexlist" component={Regexlist}/>
            <Route path="/settings/versions" name="Versions" component={Versions}/>
            <Route path="/settings/networking" name="Networking" component={Networking}/>
            <Route path="/login" name="Login" component={Login}/>
            <AuthRoute path="/logout" name="Logout" component={Logout}/>
          </Switch>
        </div>
      </main>
      <Aside/>
    </div>
    <Footer/>
  </div>
);

/**
 * Create a route which requires authentication.
 * If the user is unauthenticated, they will be redirected to the login page.
 * If the user logs in at the redirected login page, they will go to their original destination.
 *
 * @param Component The component that the authenticated user will see
 * @param rest The rest of the Route arguments
 * @returns Route
 */
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      api.loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

