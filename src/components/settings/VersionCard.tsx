/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: Version - Card component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Collapse } from "reactstrap";

export interface VersionCardProps extends WithTranslation {
  branch: string;
  hash: string;
  name: string;
  tag: string;
  icon: string;
}

export interface VersionCardState {
  collapsed: boolean;
}

class VersionCard extends Component<VersionCardProps, VersionCardState> {
  state: VersionCardState = {
    collapsed: true
  };

  render() {
    const { t } = this.props;

    return (
      <div className="card border-0 bg-primary">
        <div className="card-block">
          <div className="card-icon">
            <i className={this.props.icon} />
          </div>
        </div>
        <div className="card-body">
          <h3>{this.props.name}</h3>
          <p>
            {t("Version")}:{" "}
            {this.props.branch === "master" ? this.props.tag : "vDev"}
          </p>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => this.setState({ collapsed: !this.state.collapsed })}
          >
            {t("Details")}
          </button>
          <Collapse isOpen={!this.state.collapsed}>
            <table className="table table-borderless table-sm table-condensed mt-3 mb-0">
              <tbody>
                <tr>
                  <td>{t("Branch")}</td>
                  <td>{this.props.branch}</td>
                </tr>
                <tr>
                  <td>{t("Tag")}</td>
                  <td>{this.props.tag}</td>
                </tr>
                <tr>
                  <td>{t("Hash")}</td>
                  <td>{this.props.hash}</td>
                </tr>
              </tbody>
            </table>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default withTranslation(["common", "settings"])(VersionCard);
