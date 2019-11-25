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

interface LiveLogState {
  log: Array<{
    timestamp: number;
    message: string;
  }>;
}

let nextId = 0;

class LiveLog extends Component<LiveLogProps, LiveLogState> {
  static getDerivedStateFromProps(
    state: LiveLogState,
    props: LiveLogProps
  ): LiveLogState {
    return {
      log: [...state.log, ...props.log]
    };
  }

  state: LiveLogState = { log: [] };

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
    const outputStyle = {
      width: "100%",
      height: "100%",
      maxHeight: "648px"
    };

    return (
      <pre id="output" style={outputStyle}>
        {this.state.log.map(item => (
          <div>{getTimeFromTimestamp(item.timestamp) + " " + item.message}</div>
        ))}
      </pre>
    );
  }
}

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
    renderOk={data => <LiveLog {...data} {...props} />}
    renderErr={() => null}
  />
);
