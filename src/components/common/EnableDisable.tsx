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

import React, { Component, FormEvent } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import NavButton from "./NavButton";
import NavDropdown from "./NavDropdown";
import { StatusContext } from "./context/StatusContext";
import {
  CancelablePromise,
  makeCancelable
} from "../../util/CancelablePromise";
import api from "../../util/api";
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

export interface EnableDisableProps extends WithTranslation {
  status: Status;
  refresh: (data?: ApiStatus) => void;
  onSetStatus: (
    action: StatusAction,
    time?: number
  ) => Promise<ApiSuccessResponse>;
}

export interface EnableDisableState {
  processing: boolean;
  customModalShown: boolean;
  customTime: number;
  customMultiplier: number;
}

export class EnableDisable extends Component<
  EnableDisableProps,
  EnableDisableState
> {
  state: EnableDisableState = {
    processing: false,
    customModalShown: false,
    customTime: 60,
    customMultiplier: 60
  };

  private updateHandler: CancelablePromise<ApiSuccessResponse> | undefined;

  /**
   * Convert a status action into a status. ex. "enable" -> "enabled"
   *
   * @param action The action
   * @returns {string} The associated status
   */
  getStatusFromAction = (action: StatusAction): Status => {
    switch (action) {
      case "enable":
        return "enabled";
      case "disable":
        return "disabled";
    }
  };

  /**
   * Send a request to the API to update the status
   *
   * @param action The action to perform ("enable" or "disable")
   * @param time The amount of time to disable for. This setting is optional.
   */
  setStatus = (action: StatusAction, time?: number) => {
    if (this.state.processing) {
      // Wait for the first status change to go through
      return;
    }

    // Only allow one status update at a time
    this.toggleProcessing();

    // Send the status change request
    this.updateHandler = makeCancelable(this.props.onSetStatus(action, time));
    this.updateHandler.promise
      // Refresh once we get a good response
      .then(() =>
        this.props.refresh({ status: this.getStatusFromAction(action) })
      )
      // Allow new status changes when finished
      .then(this.toggleProcessing)
      .catch(e => {
        // Ignore canceled requests
        if (e.isCanceled) {
          return;
        }

        // Even if it failed, allow new status changes
        this.toggleProcessing();
      });
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
   * Toggle the processing flag
   */
  toggleProcessing = () => {
    this.setState(prevState => ({ processing: !prevState.processing }));
  };

  /**
   * Submit the request to disable blocking for the custom time that the user
   * input.
   *
   * @param e the submit event
   */
  submitCustom = (e: FormEvent) => {
    e.preventDefault();

    this.setState({ customModalShown: false });
    this.setStatus(
      "disable",
      this.state.customTime * this.state.customMultiplier
    );
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
                onChange={e =>
                  this.setState({ customTime: parseInt(e.target.value) })
                }
              />
              <InputGroupAddon addonType="append">
                <Input
                  type="select"
                  value={this.state.customMultiplier}
                  onChange={e =>
                    this.setState({
                      customMultiplier: parseInt(e.target.value)
                    })
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

export const TranslatedEnableDisable = withTranslation("common")(EnableDisable);

export const EnableDisableContainer = () => (
  <StatusContext.Consumer>
    {({ status, refresh }) => (
      <TranslatedEnableDisable
        status={status}
        refresh={refresh}
        onSetStatus={api.setStatus}
      />
    )}
  </StatusContext.Consumer>
);
