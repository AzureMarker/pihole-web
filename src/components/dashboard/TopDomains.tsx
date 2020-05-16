/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Top Domains component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import TopTable from "./TopTable";
import { TFunction } from "i18next";
import { TimeRangeContext } from "../common/context/TimeRangeContext";

export interface TopDomainsData {
  totalQueries: number;
  topDomains: ApiTopDomainItem[];
}

/**
 * Transform the API data into the form used in generateRows
 *
 * @param data the API data
 * @returns {{totalQueries: number, topDomains: *}} the parsed data
 */
export const transformData = (data: ApiTopDomains): TopDomainsData => ({
  totalQueries: data.total_queries,
  topDomains: data.top_domains
});

/**
 * Create a function to generate rows of top domains
 *
 * @param t the translation function
 * @returns {function(*): any[]} a function to generate rows of top domains
 */
export const generateRows = (t: TFunction) => (data: TopDomainsData) => {
  return data.topDomains.map(item => {
    const percentage = (item.count / data.totalQueries) * 100;

    return (
      <tr key={item.domain}>
        <td>{item.domain}</td>
        <td>{item.count.toLocaleString()}</td>
        <td className="align-middle">
          <div
            className="progress"
            title={t("{{percent}}% of {{total}}", {
              percent: percentage.toFixed(1),
              total: data.totalQueries.toLocaleString()
            })}
          >
            <div
              className="progress-bar bg-success"
              style={{ width: percentage + "%" }}
            />
          </div>
        </td>
      </tr>
    );
  });
};

const TopDomains = ({
  apiCall,
  t,
  ...props
}: WithTranslation & { apiCall: () => Promise<ApiTopDomains> }) => (
  <TopTable
    {...props}
    title={t("Top Permitted Domains")}
    initialData={{
      totalQueries: 0,
      topDomains: []
    }}
    headers={[t("Domain"), t("Hits"), t("Frequency")]}
    emptyMessage={t("No Domains Found")}
    isEmpty={data => data.topDomains.length === 0}
    apiCall={apiCall}
    apiHandler={transformData}
    generateRows={generateRows(t)}
  />
);

const TopDomainsContainer = (props: WithTranslation) => (
  <TimeRangeContext.Consumer>
    {context => (
      <TopDomains
        {...props}
        apiCall={() =>
          context.range
            ? api.getTopDomainsDb(context.range)
            : api.getTopDomains()
        }
      />
    )}
  </TimeRangeContext.Consumer>
);

export default withTranslation(["common", "dashboard"])(TopDomainsContainer);
