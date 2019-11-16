/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Navigation information
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import Dashboard from "./views/Dashboard";
import QueryLog from "./components/log/QueryLog";
import ExactWhitelist from "./views/ExactWhitelist";
import ExactBlacklist from "./views/ExactBlacklist";
import RegexWhitelist from "./views/RegexWhitelist";
import RegexBlacklist from "./views/RegexBlacklist";
import Versions from "./views/Versions";
import Networking from "./views/Networking";
import Login from "./views/Login";
import Logout from "./views/Logout";
import { EnableDisableContainer } from "./components/common/EnableDisable";
import Preferences from "./views/Preferences";
import i18next from "i18next";
import { ComponentType } from "react";

export const routes = (t: i18next.TFunction): { [key: string]: string } => ({
  "/dashboard": t("Dashboard"),
  "/query-log": t("Query Log"),
  "/whitelist/exact": `${t("Whitelist")} (${t("Exact")})`,
  "/whitelist/regex": `${t("Whitelist")} (${t("Regex")})`,
  "/blacklist/exact": `${t("Blacklist")} (${t("Exact")})`,
  "/blacklist/regex": `${t("Blacklist")} (${t("Regex")})`,
  "/settings/versions": t("Versions"),
  "/settings/networking": t("Networking"),
  "/settings/preferences": t("Preferences"),
  "/login": t("Login"),
  "/logout": t("Logout")
});

export interface RouteItem {
  name: string;
  url: string;
  component: ComponentType<any>;
  icon: string;
  auth: boolean;
  authStrict?: boolean;
}

export interface RouteCustomItem {
  customComponent: ComponentType<any>;
  auth: boolean;
  authStrict?: boolean;
  fakeRoute: boolean;
}

export interface RouteGroup {
  name: string;
  url: string;
  icon: string;
  auth: boolean;
  authStrict?: boolean;
  children: Array<RouteData>;
}

export type RouteData = RouteItem | RouteGroup | RouteCustomItem;

export const nav: Array<RouteData> = [
  {
    name: "Dashboard",
    url: "/dashboard",
    component: Dashboard,
    icon: "fa fa-tachometer-alt",
    auth: false
  },
  {
    name: "Query Log",
    url: "/query-log",
    component: QueryLog,
    icon: "fa fa-database",
    auth: true
  },
  {
    name: "Whitelist",
    url: "/whitelist",
    icon: "far fa-check-circle",
    auth: false,
    children: [
      {
        name: "Exact whitelist",
        url: "/whitelist/exact",
        component: ExactWhitelist,
        icon: "fa fa-check-circle",
        auth: false
      },
      {
        name: "Regex whitelist",
        url: "/whitelist/regex",
        component: RegexWhitelist,
        icon: "fa fa-check-circle",
        auth: false
      }
    ]
  },
  {
    name: "Blacklist",
    url: "/blacklist",
    icon: "fa fa-ban",
    auth: false,
    children: [
      {
        name: "Exact blacklist",
        url: "/blacklist/exact",
        component: ExactBlacklist,
        icon: "fa fa-ban",
        auth: false
      },
      {
        name: "Regex blacklist",
        url: "/blacklist/regex",
        component: RegexBlacklist,
        icon: "fa fa-ban",
        auth: false
      }
    ]
  },
  {
    customComponent: EnableDisableContainer,
    fakeRoute: true,
    auth: true
  },
  {
    name: "Settings",
    url: "/settings",
    icon: "fa fa-wrench",
    auth: true,
    children: [
      {
        name: "Versions",
        url: "/settings/versions",
        component: Versions,
        icon: "fa fa-download",
        auth: true
      },
      {
        name: "Networking",
        url: "/settings/networking",
        component: Networking,
        icon: "fa fa-sitemap",
        auth: true
      },
      {
        name: "Preferences",
        url: "/settings/preferences",
        component: Preferences,
        icon: "fa fa-sliders-h",
        auth: true
      }
    ]
  },
  {
    name: "Login",
    url: "/login",
    component: Login,
    icon: "fa fa-user",
    auth: false,
    authStrict: true
  },
  {
    name: "Logout",
    url: "/logout",
    component: Logout,
    icon: "fa fa-user-times",
    auth: true,
    authStrict: true
  }
];
