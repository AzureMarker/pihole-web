/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Top Clients component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import api from "../../util/api";
import TopTable from "./TopTable";
import i18next from "i18next";
import { TimeRangeContext } from "../common/context/TimeRangeContext";

export interface TopBlockedClientsData {
  blockedQueries: number;
  topClients: Array<ApiClient>;
}

/**
 * Transform the API data into the form used in generateRows
 *
 * @param data The API data
 * @returns The parsed data
 */
export const transformData = (
  data: ApiTopBlockedClients
): TopBlockedClientsData => ({
  blockedQueries: data.blocked_queries,
  topClients: data.top_clients
});

/**
 * Create a function to generate rows of top clients
 *
 * @param t The translation function
 * @returns A function to generate rows of top clients
 */
export const generateRows = (t: i18next.TranslationFunction) => (
  data: TopBlockedClientsData
): Array<ReactNode> => {
  return data.topClients.map(item => {
    const percentage = (item.count / data.blockedQueries) * 100;

    return (
      <tr key={item.name + "|" + item.ip}>
        <td>{item.name !== "" ? item.name : item.ip}</td>
        <td>{item.count.toLocaleString()}</td>
        <td style={{ verticalAlign: "middle" }}>
          <div
            className="progress"
            title={t("{{percent}}% of {{total}}", {
              percent: percentage.toFixed(1),
              total: data.blockedQueries.toLocaleString()
            })}
          >
            <div
              className="progress-bar bg-danger"
              style={{ width: percentage + "%" }}
            />
          </div>
        </td>
      </tr>
    );
  });
};

const TopClients = ({
  apiCall,
  t,
  ...props
}: WithNamespaces & { apiCall: () => Promise<ApiTopBlockedClients> }) => (
  <TopTable
    {...props}
    title={t("Top Blocked Clients")}
    initialData={{
      blockedQueries: 0,
      topClients: []
    }}
    headers={[t("Client"), t("Requests"), t("Frequency")]}
    emptyMessage={t("No Clients Found")}
    isEmpty={data => data.topClients.length === 0}
    apiCall={apiCall}
    apiHandler={transformData}
    generateRows={generateRows(t)}
  />
);

const TopClientsContainer = (props: WithNamespaces) => (
  <TimeRangeContext.Consumer>
    {context => (
      <TopClients
        {...props}
        apiCall={() =>
          context.range
            ? api.getTopBlockedClientsDb(context.range)
            : api.getTopBlockedClients()
        }
      />
    )}
  </TimeRangeContext.Consumer>
);

export default withNamespaces(["common", "dashboard"])(TopClientsContainer);
