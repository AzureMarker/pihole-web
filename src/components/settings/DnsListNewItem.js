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

export default class DnsListNewItem extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired
  };

  state = {
    address: ""
  };

  render() {
    const isAddressValid = this.props.isValid(this.state.address);

    return (
      <ListGroupItem>
        <InputGroup>
          <Input
            type="text"
            value={this.state.address}
            onChange={e => this.setState({ address: e.target.value })}
          />
          <InputGroupAddon addonType="append">
            <Button
              color="success"
              size="sm"
              className="pull-right"
              onClick={() => {
                this.props.onAdd(this.state.address);
                this.setState({ address: "" });
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
