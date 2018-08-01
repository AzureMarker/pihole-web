/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: FTL Information component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { translate } from "react-i18next";
import { api, ignoreCancel, makeCancelable } from "../utils";

class FTLInfo extends Component {
  state = {
    filesize: "---",
    queries: "---",
    sqlite_version: "---"
  };

  constructor(props) {
    super(props);
    this.updateFTLInfo = this.updateFTLInfo.bind(this);
  }

  updateFTLInfo() {
    this.updateHandler = makeCancelable(api.getFTLdb(), { repeat: this.updateFTLInfo, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState({
        queries: res.queries.toLocaleString(),
        filesize: res.filesize.toLocaleString(),
        sqlite_version: res.sqlite_version
      });
    })
      .catch(ignoreCancel)
      .catch(() => {
          this.setState({
            queries: "-!-",
            filesize: "-!-",
            sqlite_version: "-!-"
          });
        }
      );
  }

  componentDidMount() {
    this.updateFTLInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="card border-0 bg-success stat-dbl-height-lock">
        <div className="card-block">
          <div className="card-icon">
            <i className="fa fa-database fa-2x"/>
          </div>
        </div>
        <div className="card-img-overlay">
          <h3>
            {t("FTL Database")}
          </h3>
          <pre>
            {t("Queries")}: {this.state.queries}<br/>
            {t("Filesize")}: {this.state.filesize} B<br/>
            {t("SQLite version")}: {this.state.sqlite_version}<br/>
          </pre>
        </div>
      </div>
    );
  }
}

export default translate(["settings"])(FTLInfo);
