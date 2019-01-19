/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Summary Stats component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { WithAPIData } from "../common/WithAPIData";
import api from "../../util/api";

class SummaryStats extends Component {
  static propTypes = {
    totalQueries: PropTypes.string.isRequired,
    blockedQueries: PropTypes.string.isRequired,
    percentBlocked: PropTypes.string.isRequired,
    gravityDomains: PropTypes.string.isRequired,
    uniqueClients: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired
  };

  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <div className="col-lg-3 col-xs-12">
          <div className="card border-0 bg-success stat-height-lock">
            <div className="card-body">
              <div className="card-icon">
                <i className="fa fa-globe-americas fa-2x" />
              </div>
            </div>
            <div className="card-img-overlay">
              <h3>{this.props.totalQueries}</h3>
              <p style={{ marginBottom: "0px" }}>
                {t("Total Queries ({{count}} clients)", {
                  count: this.props.uniqueClients
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card border-0 bg-primary stat-height-lock">
            <div className="card-body">
              <div className="card-icon">
                <i className="far fa-hand-paper fa-2x" />
              </div>
            </div>
            <div className="card-img-overlay">
              <h3>{this.props.blockedQueries}</h3>
              <p style={{ marginBottom: "0px" }}>{t("Queries Blocked")}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card border-0 bg-warning stat-height-lock">
            <div className="card-body">
              <div className="card-icon">
                <i className="fa fa-chart-pie fa-2x" />
              </div>
            </div>
            <div className="card-img-overlay">
              <h3>{this.props.percentBlocked}</h3>
              <p style={{ marginBottom: "0px" }}>{t("Percent Blocked")}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xs-12">
          <div className="card border-0 bg-danger stat-height-lock">
            <div className="card-body">
              <div className="card-icon">
                <i className="far fa-list-alt fa-2x" />
              </div>
            </div>
            <div className="card-img-overlay">
              <h3>{this.props.gravityDomains}</h3>
              <p style={{ marginBottom: "0px" }}>{t("Domains On Blocklist")}</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

/**
 * Transform the API data into props for the component
 *
 * @param data the API data
 * @returns {*} the transformed props
 */
export const transformData = data => ({
  totalQueries: Object.keys(data.total_queries)
    .reduce((total, queryType) => total + data.total_queries[queryType], 0)
    .toLocaleString(),
  blockedQueries: data.blocked_queries.toLocaleString(),
  percentBlocked: data.percent_blocked.toFixed(2).toLocaleString() + "%",
  gravityDomains: data.gravity_size.toLocaleString(),
  uniqueClients: data.total_clients
});

/**
 * The props the summary stats should use when it fails to get the API data
 * (it does not need the error object)
 */
export const errorProps = {
  totalQueries: "Lost",
  blockedQueries: "Connection",
  percentBlocked: "To",
  gravityDomains: "API",
  uniqueClients: ""
};

/**
 * The props used to show a loading state
 */
export const initialProps = {
  blockedQueries: "---",
  totalQueries: "---",
  percentBlocked: "---",
  gravityDomains: "---",
  uniqueClients: "---"
};

export const TranslatedSummaryStats = withNamespaces(["common", "dashboard"])(
  SummaryStats
);

export default props => (
  <WithAPIData
    apiCall={api.getSummary}
    repeatOptions={{ interval: 5000 }}
    renderInitial={() => (
      <TranslatedSummaryStats {...initialProps} {...props} />
    )}
    renderOk={data => (
      <TranslatedSummaryStats {...transformData(data)} {...props} />
    )}
    renderErr={() => <TranslatedSummaryStats {...errorProps} {...props} />}
  />
);
