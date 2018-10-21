/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Clients component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import { api } from "../../utils";
import TopTable from "./TopTable";

const TopClients = ({ t, ...props }) => (
  <TopTable
    {...props}
    title={t("Top Clients")}
    initialState={{
      total_queries: 0,
      top_clients: []
    }}
    headers={[t("Client"), t("Requests"), t("Frequency")]}
    emptyMessage={t("No Clients Found")}
    isEmpty={state => state.top_clients.length === 0}
    apiCall={api.getTopClients}
    apiHandler={(self, res) => {
      self.setState({
        loading: false,
        total_queries: res.total_queries,
        top_clients: res.top_clients
      });
    }}
    generateRows={state => {
      return state.top_clients.map(item => {
        const percentage = (item.count / state.total_queries) * 100;

        return (
          <tr key={item.name + "|" + item.ip}>
            <td>{item.name !== "" ? item.name : item.ip}</td>
            <td>{item.count.toLocaleString()}</td>
            <td style={{ verticalAlign: "middle" }}>
              <div
                className="progress"
                title={t("{{percent}}% of {{total}}", {
                  percent: percentage.toFixed(1),
                  total: state.total_queries.toLocaleString()
                })}
              >
                <div
                  className="progress-bar bg-primary"
                  style={{ width: percentage + "%" }}
                />
              </div>
            </td>
          </tr>
        );
      });
    }}
  />
);

export default translate(["common", "dashboard"])(TopClients);
