/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Live Log component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { animateScroll } from "react-scroll";
import { WithAPIData } from "../common/WithAPIData";
import { getTimeFromTimestamp } from "../../util/dateUtils";
import api from "../../util/api";
import { Input, Container, Row, Col } from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

export interface LiveLogProps {
  log: Array<{
    timestamp: number;
    message: string;
  }>;
  nextID: number;
}

interface LiveLogState {
  log: Array<{
    timestamp: number;
    message: string;
  }>;
}

let nextId = 0;
class LiveLog extends Component<LiveLogProps & WithTranslation, LiveLogState> {
  static getDerivedStateFromProps(
    state: LiveLogState,
    props: LiveLogProps
  ): LiveLogState {
    return {
      log: [...props.log, ...state.log]
    };
  }

  state: LiveLogState = { log: [] };
  checked: boolean = true;

  componentDidUpdate() {
    if (this.checked) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "output",
      duration: 250,
      delay: 0,
      isDynamic: true
    });
  }

  render() {
    const outputStyle = {
      width: "100%",
      height: "100%",
      maxHeight: "648px"
    };

    const { t } = this.props;

    // variable for containing an autonumber to assign to the `key` property of each item in the log output.
    // see https://reactjs.org/docs/lists-and-keys.html#keys
    let uniqueKey: number = 0;

    return (
      <Container>
        <Row>
          <Col>
            <Input
              type="checkbox"
              checked={this.checked}
              onChange={() => {
                return (this.checked = !this.checked);
              }}
            />
            {t("Automatic scrolling on update")}
          </Col>
        </Row>
        <Row>
          <Col>
            <pre id="output" style={outputStyle}>
              {this.state.log.map(item => (
                <div key={uniqueKey++}>
                  {getTimeFromTimestamp(item.timestamp) + " " + item.message}
                </div>
              ))}
            </pre>
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              type="checkbox"
              checked={this.checked}
              onChange={() => {
                return (this.checked = !this.checked);
              }}
            />
            {t("Automatic scrolling on update")}
          </Col>
        </Row>
      </Container>
    );
  }
}

export const TranslatedLiveLog = withTranslation(["live-log"])(LiveLog);

export default (props: any) => (
  <WithAPIData
    apiCall={() => {
      return api.getLiveLog(nextId).then(response => {
        nextId = response.nextID;
        return response;
      });
    }}
    repeatOptions={{ interval: 500, ignoreCancel: true }}
    renderInitial={() => null}
    renderOk={data => <TranslatedLiveLog {...data} {...props} />}
    renderErr={() => null}
  />
);
