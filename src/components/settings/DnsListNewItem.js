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
import { Button, InputGroup, InputGroupAddon, ListGroupItem } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { translate } from "react-i18next";
import { preconfiguredUpstreamOptions } from "./preconfiguredUpstreams";

/**
 * A component to add upstream DNS servers. The servers are either selected from
 * a list of preconfigured upstreams, or custom servers can be input.
 */
class DnsListNewItem extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    upstreams: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  state = {
    address: "",
    selected: []
  };

  constructor(props) {
    super(props);
    this.typeahead = React.createRef();
  }

  /**
   * Get the currently selected upstream address (either custom or preconfigured)
   *
   * @returns {string} the selected upstream address
   */
  getAddress = () => {
    if (this.state.selected.length === 0) {
      return this.state.address;
    }

    return this.state.selected[0].address;
  };

  render() {
    const { t } = this.props;

    const isAddressValid = this.props.isValid(this.getAddress());

    return (
      <ListGroupItem>
        <InputGroup>
          <Typeahead
            onInputChange={address => this.setState({ address })}
            onChange={selected => this.setState({ selected })}
            options={preconfiguredUpstreamOptions.filter(
              upstream => !this.props.upstreams.includes(upstream.address)
            )}
            selected={this.state.selected}
            emptyLabel={t("Detected custom upstream server")}
            bodyContainer
            ref={this.typeahead}
          />

          <InputGroupAddon addonType="append">
            <Button
              color="success"
              size="sm"
              onClick={() => {
                // Add the server to the list
                this.props.onAdd(this.getAddress());

                // Reset the input
                this.setState({ address: "", selected: [] });
                this.typeahead.current.getInstance().clear();
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

export default translate("settings")(DnsListNewItem);
