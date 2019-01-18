/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: FTL Information component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import api from "../../util/api";
import { WithAPIData } from "../common/WithAPIData";

class FTLInfo extends Component {
  static propTypes = {
    fileSize: PropTypes.number.isRequired,
    queries: PropTypes.number.isRequired,
    sqliteVersion: PropTypes.string.isRequired
  };

  render() {
    const { t } = this.props;

    return (
      <pre>
        {t("Queries")}: {this.props.queries}
        <br />
        {t("Filesize")}: {this.props.fileSize.toLocaleString()} B<br />
        {t("SQLite version")}: {this.props.sqliteVersion.toLocaleString()}
        <br />
      </pre>
    );
  }
}

export const transformData = data => ({
  fileSize: data.filesize,
  queries: data.queries,
  sqliteVersion: data.sqlite_version
});

export const initialData = {
  fileSize: 0,
  queries: 0,
  sqliteVersion: ""
};

export const TranslatedFTLInfo = withNamespaces(["settings"])(FTLInfo);

export default props => (
  <WithAPIData
    apiCall={api.getFTLdb}
    repeatOptions={{
      interval: 600000
    }}
    renderInitial={() => <TranslatedFTLInfo {...initialData} {...props} />}
    renderOk={data => <TranslatedFTLInfo {...transformData(data)} {...props} />}
    renderErr={() => <TranslatedFTLInfo {...initialData} {...props} />}
  />
);
