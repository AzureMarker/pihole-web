/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: Version Information component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import api, { ApiVersions } from "../../util/api";
import VersionCard from "./VersionCard";
import { WithAPIData } from "../common/WithAPIData";

class VersionInfo extends Component<ApiVersions & WithNamespaces, {}> {
  render() {
    const { t } = this.props;

    return (
      <div className="row">
        <div className="col-xl-3 col-md-6 col-xs-12">
          <VersionCard
            name={t("Core")}
            icon="far fa-dot-circle fa-2x"
            branch={this.props.core.branch}
            hash={this.props.core.hash}
            tag={this.props.core.tag}
          />
        </div>
        <div className="col-xl-3 col-md-6 col-xs-12">
          <VersionCard
            name={t("FTL")}
            icon="fa fa-industry fa-2x"
            branch={this.props.ftl.branch}
            hash={this.props.ftl.hash}
            tag={this.props.ftl.tag}
          />
        </div>
        <div className="col-xl-3 col-md-6 col-xs-12">
          <VersionCard
            name={t("API")}
            icon="fa fa-bullseye fa-2x"
            branch={this.props.api.branch}
            hash={this.props.api.hash}
            tag={this.props.api.tag}
          />
        </div>
        <div className="col-xl-3 col-md-6 col-xs-12">
          <VersionCard
            name={t("Web")}
            icon="far fa-list-alt fa-2x"
            branch={this.props.web.branch}
            hash={this.props.web.hash}
            tag={this.props.web.tag}
          />
        </div>
      </div>
    );
  }
}

export const initialData: ApiVersions = {
  api: {
    branch: "unknown",
    hash: "unknown",
    tag: "unknown"
  },
  core: {
    branch: "unknown",
    hash: "unknown",
    tag: "unknown"
  },
  ftl: {
    branch: "unknown",
    hash: "unknown",
    tag: "unknown"
  },
  web: {
    branch: "unknown",
    hash: "unknown",
    tag: "unknown"
  }
};

export const TranslatedVersionInfo = withNamespaces(["common"])(VersionInfo);

export default (props: any) => (
  <WithAPIData
    apiCall={api.getVersion}
    repeatOptions={{ interval: 600000, ignoreCancel: true }}
    renderInitial={() => <TranslatedVersionInfo {...initialData} {...props} />}
    renderOk={data => <TranslatedVersionInfo {...data} {...props} />}
    renderErr={() => <TranslatedVersionInfo {...initialData} {...props} />}
  />
);
