/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Top Blocked Clients component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import TopTable from "./TopTable";
import { TFunction } from "i18next";
import { TimeRangeContext } from "../common/context/TimeRangeContext";

export interface TopBlockedClientsData {
  blockedQueries: number;
  topClients: Array<ApiClientData>;
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
 * Generate rows of top blocked clients
 *
 * @param t The translation function
 * @returns Rows of top blocked clients
 */
export const generateRows = (t: TFunction) => (
  data: TopBlockedClientsData
): ReactNode => {
  return data.topClients.map(item => {
    const percentage = (item.count / data.blockedQueries) * 100;

    return (
      <tr key={item.name + "|" + item.ip}>
        <td>{item.name !== "" ? item.name : item.ip}</td>
        <td>{item.count.toLocaleString()}</td>
        <td className="align-middle">
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

const TopBlockedClients = ({
  apiCall,
  t,
  ...props
}: WithTranslation & { apiCall: () => Promise<ApiTopBlockedClients> }) => (
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

const TopBlockedClientsContainer = (props: WithTranslation) => (
  <TimeRangeContext.Consumer>
    {context => (
      <TopBlockedClients
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

export default withTranslation(["common", "dashboard"])(
  TopBlockedClientsContainer
);
