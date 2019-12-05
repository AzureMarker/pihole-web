/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: DNS Cache Information component
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

export interface CacheInfoState {
  cache_size: number;
  cache_evicted: number;
  cache_inserted: number;
}

class CacheInfo extends Component<WithTranslation, CacheInfoState> {
  state: CacheInfoState = {
    cache_size: 0,
    cache_evicted: 0,
    cache_inserted: 0
  };

  componentDidMount() {
    this.loadCacheInfo();
  }

  componentWillUnmount() {
    if (this.loadHandler) {
      this.loadHandler.cancel();
    }
  }

  private loadHandler: undefined | CancelablePromise<ApiCacheResponse>;

  loadCacheInfo = () => {
    this.loadHandler = makeCancelable(api.getCacheInfo());
    this.loadHandler.promise
      .then(res => {
        this.setState({
          cache_size: res.cache_size,
          cache_evicted: res.cache_evicted,
          cache_inserted: res.cache_inserted
        });
      })
      .catch(ignoreCancel);
  };

  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup row>
          <Label className="font-weight-bold" for="cache_size" sm={4}>
            {t("DNS cache size")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="cache_size"
              value={this.state.cache_size.toLocaleString()}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="font-weight-bold" for="cache_evicted" sm={4}>
            {t("DNS cache evictions")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="cache_evicted"
              value={this.state.cache_evicted.toLocaleString()}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="font-weight-bold" for="cache_inserted" sm={4}>
            {t("DNS cache insertions")}
          </Label>
          <Col sm={8}>
            <Input
              plaintext
              readOnly
              id="cache_inserted"
              value={this.state.cache_inserted}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default withTranslation(["settings"])(CacheInfo);
