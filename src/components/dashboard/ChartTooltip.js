/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Chart Tooltip component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";

class ChartTooltip extends Component {
  state = {
    tooltip: null
  };

  render() {
    const { tooltip } = this.state;

    // Override the graph's options in a hacky way to avoid redrawing the entire graph.
    // This lets the graph directly update the tooltip without going through the parent component.
    let lastTime = Date.now();
    this.props.handler.custom = tooltip => {
      // Always disable the tooltip
      if (tooltip.opacity === 0) this.setState({ tooltip });

      // Limit how quickly we set state (50ms)
      const now = Date.now();
      if (now - lastTime < 50) return;

      lastTime = now;
      this.setState({ tooltip });
    };

    // Don't render anything if there is nothing to render
    if (
      tooltip === null ||
      tooltip.opacity === 0 ||
      this.props.chart.current === null
    )
      return null;

    // Get the graph's position data so we can offset the tooltip
    const position = this.props.chart.current.chartInstance.canvas.getBoundingClientRect();
    let width = tooltip.caretX;

    // Prevent compression of the tooltip at the right edge of the screen
    if (document.offsetWidth - tooltip.caretX < 400)
      width = document.offsetWidth - 400;

    // Prevent tooltip disappearing behind the sidebar
    if (tooltip.caretX < 100) width = 100;

    // Tooltip CSS styling
    const style = {
      opacity: 1,
      left: position.left + width + "px",
      top: position.top + tooltip.caretY + window.scrollY + "px",
      fontFamily: tooltip._bodyFontFamily,
      fontSize: tooltip.bodyFontSize + "px",
      fontStyle: tooltip._bodyFontStyle,
      padding: tooltip.yPadding + "px " + tooltip.xPadding + "px"
    };

    // Transform and sort the tooltip data
    let data = [];
    if (tooltip.body) {
      data = tooltip.body
        .map(body => body.lines)
        .map((item, i) => ({
          data: item[0],
          colors: tooltip.labelColors[i]
        }));
    }
    data.sort((a, b) =>
      a.data.split(": ")[0].localeCompare(b.data.split(": ")[0])
    );

    return (
      <div className="chartjs-tooltip" style={style}>
        <table>
          <thead>
            {tooltip.title.map((title, i) => (
              <tr key={i}>
                <th>{title}</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>
                  <span
                    className="chartjs-tooltip-key"
                    style={{
                      background: item.colors.backgroundColor,
                      borderColor: item.colors.borderColor,
                      borderWidth: "2px"
                    }}
                  />
                  {item.data}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ChartTooltip.propTypes = {
  chart: PropTypes.object.isRequired,
  handler: PropTypes.shape({
    custom: PropTypes.func.isRequired
  }).isRequired
};

export default ChartTooltip;
