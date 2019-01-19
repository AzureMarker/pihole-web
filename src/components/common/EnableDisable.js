/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * The enable/disable sidebar button
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import NavButton from "./NavButton";
import NavDropdown from "./NavDropdown";
import { StatusContext } from "./context";
import { makeCancelable } from "../../util";
import api from "../../util/api";
import {
  Form,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Input,
  InputGroupAddon,
  InputGroup,
  Button
} from "reactstrap";

class EnableDisable extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired
  };

  state = {
    processing: false,
    customModalShown: false,
    customTime: 60,
    customMultiplier: 60
  };

  setStatus = (action, time = null) => {
    if (this.state.processing) {
      // Wait for the first status change to go through
      return;
    }

    // Only allow one status update at a time
    this.setState({ processing: true });

    // Send the status change request
    this.updateHandler = makeCancelable(api.setStatus(action, time));
    this.updateHandler.promise
      // Refresh once we get a good response
      .then(() => this.props.refresh())
      // Even if it failed, allow new status changes
      .finally(() => this.setState({ processing: false }));
  };

  componentWillUnmount() {
    if (this.updateHandler) {
      this.updateHandler.cancel();
    }
  }

  /**
   * Toggle the custom time modal
   */
  toggleModal = () => {
    this.setState({ customModalShown: !this.state.customModalShown });
  };

  /**
   * Submit the request to disable blocking for the custom time that the user
   * input.
   *
   * @param e the submit event
   */
  submitCustom = e => {
    e.preventDefault();

    const time = parseInt(this.state.customTime);
    const multiplier = parseInt(this.state.customMultiplier);

    this.setState({ customModalShown: false });
    this.setStatus("disable", time * multiplier);
  };

  /**
   * Render the custom time modal
   *
   * @returns {*} the modal component tree
   */
  renderModal = () => {
    const { t } = this.props;

    return (
      <Modal
        isOpen={this.state.customModalShown}
        toggle={this.toggleModal}
        style={{ maxWidth: "300px" }}
      >
        <Form onSubmit={this.submitCustom}>
          <ModalHeader toggle={this.toggleModal}>
            {t("Custom time")}
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <Input
                type="number"
                value={this.state.customTime}
                onChange={e => this.setState({ customTime: e.target.value })}
              />
              <InputGroupAddon addonType="append">
                <Input
                  type="select"
                  value={this.state.customMultiplier}
                  onChange={e =>
                    this.setState({ customMultiplier: e.target.value })
                  }
                >
                  <option value={1}>{t("Seconds")}</option>
                  <option value={60}>{t("Minutes")}</option>
                </Input>
              </InputGroupAddon>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit">{t("Apply")}</Button>
            <Button onClick={this.toggleModal}>{t("Cancel")}</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  };

  render() {
    const { t, status } = this.props;

    switch (status) {
      case "enabled":
        return (
          <NavDropdown name={t("Disable")} icon="fa fa-stop" isOpen={false}>
            <NavButton
              name={t("Permanently")}
              icon="fa fa-stop"
              onClick={() => this.setStatus("disable")}
            />
            <NavButton
              name={t("For {{time}} seconds", { time: 10 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 10)}
            />
            <NavButton
              name={t("For {{time}} seconds", { time: 30 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 30)}
            />
            <NavButton
              name={t("For {{time}} minutes", { time: 5 })}
              icon="fa fa-clock"
              onClick={() => this.setStatus("disable", 5 * 60)}
            />
            <NavButton
              name={t("Custom time")}
              icon="fa fa-clock"
              onClick={this.toggleModal}
            />
            {this.renderModal()}
          </NavDropdown>
        );
      case "disabled":
        return (
          <NavButton
            name={t("Enable")}
            icon="fa fa-play"
            onClick={() => this.setStatus("enable")}
          />
        );
      case "unknown":
      default:
        return null;
    }
  }
}

export const TranslatedEnableDisable = withNamespaces("common")(EnableDisable);

export default () => (
  <StatusContext.Consumer>
    {({ status, refresh }) => (
      <TranslatedEnableDisable status={status} refresh={refresh} />
    )}
  </StatusContext.Consumer>
);
