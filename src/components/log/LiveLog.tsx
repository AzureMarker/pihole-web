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

export interface LiveLogProps {
  log: Array<{
    timestamp: number;
    message: string;
  }>;
  nextID: number;
}

let nextId = 0;
let logHistory = new Array<string>();

class LiveLog extends Component<LiveLogProps, {}> {
  componentDidUpdate() {
    this.scrollToBottom();
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
    const { log } = this.props;

    nextId = this.props.nextID;

    log.map(item =>
      logHistory.push(getTimeFromTimestamp(item.timestamp) + " " + item.message)
    );

    const outputStyle = {
      width: "100%",
      height: "100%",
      maxHeight: "648px"
    };

    return (
      <pre id="output" style={outputStyle}>
        {logHistory.map(item => (
          <div>{item}</div>
        ))}
      </pre>
    );
  }
}

export default (props: any) => (
  <WithAPIData
    apiCall={() => api.getLiveLog(nextId)}
    repeatOptions={{ interval: 500, ignoreCancel: true }}
    renderInitial={() => null}
    renderOk={data => <LiveLog {...data} {...props} />}
    renderErr={() => null}
  />
);
