/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Top Blocked component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import TopTable from "./TopTable";
import { TFunction } from "i18next";
import { TimeRangeContext } from "../common/context/TimeRangeContext";

export interface TopBlockedDomainsData {
  totalBlocked: number;
  topBlocked: Array<ApiTopDomainItem>;
}

/**
 * Transform the API data into the form used in generateRows
 *
 * @param data the API data
 * @returns {{totalBlocked: number, topBlocked: *}} the parsed data
 */
export const transformData = (
  data: ApiTopBlockedDomains
): TopBlockedDomainsData => ({
  totalBlocked: data.blocked_queries,
  topBlocked: data.top_domains
});

/**
 * Create a function to generate rows of top blocked
 *
 * @param t the translation function
 * @returns {function(*): any[]} a function to generate rows of top blocked
 */
export const generateRows = (t: TFunction) => (data: TopBlockedDomainsData) => {
  return data.topBlocked.map(item => {
    const percentage = (item.count / data.totalBlocked) * 100;

    return (
      <tr key={item.domain}>
        <td>{item.domain}</td>
        <td>{item.count.toLocaleString()}</td>
        <td className="align-middle">
          <div
            className="progress"
            title={t("{{percent}}% of {{total}}", {
              percent: percentage.toFixed(1),
              total: data.totalBlocked.toLocaleString()
            })}
          >
            <div
              className="progress-bar bg-warning"
              style={{ width: percentage + "%" }}
            />
          </div>
        </td>
      </tr>
    );
  });
};

const TopBlockedDomains = ({
  apiCall,
  t,
  ...props
}: WithTranslation & { apiCall: () => Promise<ApiTopBlockedDomains> }) => (
  <TopTable
    {...props}
    title={t("Top Blocked Domains")}
    initialData={{
      totalBlocked: 0,
      topBlocked: []
    }}
    headers={[t("Domain"), t("Hits"), t("Frequency")]}
    emptyMessage={t("No Domains Found")}
    isEmpty={data => data.topBlocked.length === 0}
    apiCall={apiCall}
    apiHandler={transformData}
    generateRows={generateRows(t)}
  />
);

const TopBlockedDomainsContainer = (props: WithTranslation) => (
  <TimeRangeContext.Consumer>
    {context => (
      <TopBlockedDomains
        {...props}
        apiCall={() =>
          context.range
            ? api.getTopBlockedDomainsDb(context.range)
            : api.getTopBlockedDomains()
        }
      />
    )}
  </TimeRangeContext.Consumer>
);

export default withTranslation(["common", "dashboard"])(
  TopBlockedDomainsContainer
);
