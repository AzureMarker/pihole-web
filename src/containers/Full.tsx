/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Main container of the web interface (performs main routing)
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ComponentType, ReactNode } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Header, { mobileSidebarHide } from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import api from "../util/api";
import { nav, RouteCustomItem, RouteData, RouteGroup, RouteItem } from "../routes";
import { GlobalContextProvider } from "../components/common/context";
import LayoutApplier from "../components/common/LayoutApplier";

export default (props: any) => (
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
const createRoute = (routeData: RouteData): ReactNode => {
  if ((routeData as RouteCustomItem).fakeRoute === true) {
    return;
  }

  if ((routeData as RouteGroup).children) {
    return (routeData as RouteGroup).children.map(createRoute);
  }

  let navItem: RouteItem = routeData as RouteItem;

  return navItem.auth ? (
    <AuthRoute
      key={navItem.url}
      path={navItem.url}
      component={navItem.component}
    />
  ) : (
    <Route key={navItem.url} path={navItem.url} component={navItem.component} />
  );
};

interface AuthRouteProps {
  /**
   * The component that the authenticated user will see
   */
  component: ComponentType<any>;

  /**
   * The route path
   */
  path: string;
}

/**
 * Create a route which requires authentication.
 * If the user is unauthenticated, they will be redirected to the login page.
 * If the user logs in at the redirected login page, they will go to their original destination.
 *
 * @param authProps The component and path to use for the route
 * @returns Route
 */
const AuthRoute = (authProps: AuthRouteProps) => {
  // Typescript only likes capitalized components in its TSX
  const Component = authProps.component;

  return (
    <Route
      path={authProps.path}
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
};
