/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Main container of the web interface (performs main routing)
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header, { mobileSidebarHide } from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import api from "../util/api";
import { nav } from "../routes";
import { GlobalContextProvider } from "../components/common/context";
import LayoutApplier from "../components/common/LayoutApplier";

export default props => (
  <div className="app">
    <GlobalContextProvider>
      <LayoutApplier />
      <Header />
      <div className="app-body">
        <Sidebar items={nav} {...props} />
        <main className="main" onClick={mobileSidebarHide}>
          <div className="container-fluid" style={{ marginTop: "1.5rem" }}>
            <Switch>
              <Redirect exact from="/" to="/dashboard" />
              {nav.map(createRoute)}
            </Switch>
          </div>
        </main>
      </div>
      <Footer />
    </GlobalContextProvider>
  </div>
);

/**
 * Create a route from the route data.
 * If the route has children, an array of routes will be returned.
 *
 * @param routeData the route data (see routes.tsx)
 */
const createRoute = routeData => {
  if (routeData.fakeRoute === true) {
    return;
  }

  if (routeData.children) {
    return routeData.children.map(createRoute);
  }

  return routeData.auth ? (
    <AuthRoute
      key={routeData.url}
      path={routeData.url}
      component={routeData.component}
    />
  ) : (
    <Route
      key={routeData.url}
      path={routeData.url}
      component={routeData.component}
    />
  );
};

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
