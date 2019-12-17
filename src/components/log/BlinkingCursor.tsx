/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Blinking cursor component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";

interface BlinkingCursorProps {
  refreshInterval: number;
}

interface BlinkingCursorState {
  showText: boolean;
}

export class BlinkingCursor extends Component<
  BlinkingCursorProps,
  BlinkingCursorState
> {
  state: BlinkingCursorState = {
    showText: true
  };

  private blinkInterval: undefined | NodeJS.Timeout;

  componentDidMount() {
    // Change the state every second
    this.blinkInterval = setInterval(
      () => {
        this.setState(previousState => ({
          showText: !previousState.showText
        }));
      },
      // Define blinking time.
      this.props.refreshInterval
    );
  }

  componentWillUnmount() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
    }
  }

  render() {
    return (
      <div style={{ marginBottom: 10 }}>{this.state.showText ? "_" : " "}</div>
    );
  }
}
