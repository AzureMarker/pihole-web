/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Input For New DNS List Items
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  ListGroupItem
} from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { recommendedUpstreamOptions } from "./recommendedUpstreams";

/**
 * A component to add upstream DNS servers. The servers are either selected from
 * a list of recommended upstreams, or custom servers can be input.
 */
export default class DnsListNewItem extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    upstreams: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  state = {
    address: "",
    selected: [],
    isCustom: false
  };

  render() {
    // Check if input is valid. If it's a custom server, validate the IP
    // address. If we're choosing a recommended server, just make sure one is
    // selected.
    const isAddressValid = this.state.isCustom
      ? this.props.isValid(this.state.address)
      : this.state.selected.length !== 0;

    // The component used for custom input
    const customInput = (
      <Input
        type="text"
        value={this.state.address}
        onChange={e => this.setState({ address: e.target.value })}
      />
    );

    // The component used for selecting a recommended server
    const recommendedInput = (
      <Typeahead
        onChange={selected => {
          this.setState({ selected });
        }}
        options={recommendedUpstreamOptions.filter(
          upstream => !this.props.upstreams.includes(upstream.address)
        )}
        selected={this.state.selected}
        bodyContainer
      />
    );

    return (
      <ListGroupItem>
        <InputGroup>
          {this.state.isCustom ? customInput : recommendedInput}

          <InputGroupAddon addonType="append">
            <Button
              size="sm"
              onClick={() => this.setState({ isCustom: !this.state.isCustom })}
            >
              {this.state.isCustom ? "Recommended" : "Custom"}
            </Button>
          </InputGroupAddon>

          <InputGroupAddon addonType="append">
            <Button
              color="success"
              size="sm"
              onClick={() => {
                // Choose the right address, given the mode we're in
                const address = this.state.isCustom
                  ? this.state.address
                  : this.state.selected[0].address;

                // Add the server to the list
                this.props.onAdd(address);
                this.setState({ address: "", selected: [] });
              }}
              disabled={!isAddressValid}
            >
              <span className="fa fa-plus" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </ListGroupItem>
    );
  }
}
