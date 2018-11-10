/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Domains component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import api from "../../util/api";
import TopTable from "./TopTable";

/**
 * Transform the API data into the form used in generateRows
 *
 * @param data the API data
 * @returns {{totalQueries: number, topDomains: *}} the parsed data
 */
export const transformData = data => ({
  totalQueries: data.total_queries,
  topDomains: data.top_domains
});

/**
 * Create a function to generate rows of top domains
 *
 * @param t the translation function
 * @returns {function(*): any[]} a function to generate rows of top domains
 */
export const generateRows = t => data => {
  return data.topDomains.map(item => {
    const percentage = (item.count / data.totalQueries) * 100;

    return (
      <tr key={item.domain}>
        <td>{item.domain}</td>
        <td>{item.count.toLocaleString()}</td>
        <td style={{ verticalAlign: "middle" }}>
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

const TopDomains = ({ t, ...props }) => (
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
    apiCall={api.getTopDomains}
    apiHandler={transformData}
    generateRows={generateRows(t)}
  />
);

export default translate(["common", "dashboard"])(TopDomains);
