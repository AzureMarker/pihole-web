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
import { WithAPIData } from "../common/WithAPIData";

export interface FTLInfoProps {
  fileSize: number;
  queries: number;
  sqliteVersion: string;
}

class FTLInfo extends Component<FTLInfoProps & WithTranslation, {}> {
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
              value={this.props.queries.toLocaleString()}
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
              value={`${this.props.fileSize.toLocaleString()} B`}
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
              value={this.props.sqliteVersion}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export const transformData = (data: ApiFtlDbResponse): FTLInfoProps => ({
  fileSize: data.filesize,
  queries: data.queries,
  sqliteVersion: data.sqlite_version
});

export const initialData = {
  fileSize: 0,
  queries: 0,
  sqliteVersion: ""
};

export const TranslatedFTLInfo = withTranslation(["settings"])(FTLInfo);

export default (props: any) => (
  <WithAPIData
    apiCall={api.getFTLdb}
    repeatOptions={{
      interval: 600000,
      ignoreCancel: true
    }}
    renderInitial={() => <TranslatedFTLInfo {...initialData} {...props} />}
    renderOk={data => <TranslatedFTLInfo {...transformData(data)} {...props} />}
    renderErr={() => <TranslatedFTLInfo {...initialData} {...props} />}
  />
);
