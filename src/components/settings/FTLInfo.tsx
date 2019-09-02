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
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Col, Input, FormGroup, Label } from "reactstrap";
import api from "../../util/api";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";

export interface FTLInfoProps {
  fileSize?: number;
  queries?: number;
  sqliteVersion?: string;
}

export interface FTLInfoState {
  fileSize: number;
  queries: number;
  sqliteVersion: string;
}

class FTLInfo extends Component<FTLInfoProps & WithTranslation, FTLInfoState> {
  state: FTLInfoState = {
    fileSize: 0,
    queries: 0,
    sqliteVersion: ""
  };

  componentDidMount() {
    this.loadFTLInfo();
  }

  componentWillUnmount() {
    if (this.loadHandler) {
      this.loadHandler.cancel();
    }
  }

  private loadHandler: undefined | CancelablePromise<ApiFtlDbResponse>;

  loadFTLInfo = () => {
    this.loadHandler = makeCancelable(api.getFTLdb());
    this.loadHandler.promise
      .then(res => {
        const transformData = (data: ApiFtlDbResponse): FTLInfoState => ({
          fileSize: data.filesize,
          queries: data.queries,
          sqliteVersion: data.sqlite_version
        });

        this.setState({ ...transformData(res) });
      })
      .catch(ignoreCancel);
  };

  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup row>
          <Label className="bold" for="queries" sm={4}>
            {t("Queries")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="queries"
              value={this.state.queries.toLocaleString()}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="filesize" sm={4}>
            {t("Filesize")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="filesize"
              value={`${this.state.fileSize.toLocaleString()} B`}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="bold" for="sqliteversion" sm={4}>
            {t("SQLite version")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="sqliteversion"
              value={this.state.sqliteVersion}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default withTranslation(["settings"])(FTLInfo);
