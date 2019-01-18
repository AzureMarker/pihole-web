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
import Whitelist from "./views/Whitelist";
import Blacklist from "./views/Blacklist";
import Regexlist from "./views/Regexlist";
import Versions from "./views/Versions";
import Networking from "./views/Networking";
import Login from "./views/Login";
import Logout from "./views/Logout";

export const routes = t => ({
  "/dashboard": t("Dashboard"),
  "/query-log": t("Query Log"),
  "/whitelist": t("Whitelist"),
  "/blacklist/exact": `${t("Blacklist")} (${t("Exact")})`,
  "/blacklist/regex": `${t("Blacklist")} (${t("Regex")})`,
  "/settings/versions": t("Versions"),
  "/settings/networking": t("Networking"),
  "/login": t("Login"),
  "/logout": t("Logout")
});

export const nav = [
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
    component: Whitelist,
    icon: "far fa-check-circle",
    auth: false
  },
  {
    name: "Blacklist",
    url: "/blacklist",
    icon: "fa fa-ban",
    auth: false,
    children: [
      {
        name: "Exact",
        url: "/blacklist/exact",
        component: Blacklist,
        icon: "fa fa-ban",
        auth: false
      },
      {
        name: "Regex",
        url: "/blacklist/regex",
        component: Regexlist,
        icon: "fa fa-ban",
        auth: false
      }
    ]
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
