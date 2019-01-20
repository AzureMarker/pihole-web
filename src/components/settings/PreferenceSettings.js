/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: Web Interface preferences
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { ignoreCancel, makeCancelable } from "../../util";
import api from "../../util/api";
import Alert from "../common/Alert";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { PreferencesContext } from "../common/context";

class PreferenceSettings extends Component {
  static propTypes = {
    settings: PropTypes.shape({
      layout: PropTypes.string.isRequired
    }),
    refresh: PropTypes.func.isRequired
  };

  state = {
    alertMessage: "",
    alertType: "",
    showAlert: false,
    processing: false,
    // Initial value is the current settings
    settings: this.props.settings
  };

  loadPreferences = () => {
    this.loadHandler = makeCancelable(api.getPreferences());
    this.loadHandler.promise
      .then(res => {
        this.setState({
          settings: {
            layout: res.layout
          }
        });
      })
      .catch(ignoreCancel);
  };

  componentDidMount() {
    this.loadPreferences();
  }

  componentWillUnmount() {
    this.loadHandler.cancel();

    if (this.updateHandler) {
      this.updateHandler.cancel();
    }
  }

  /**
   * Create a function which will update the key in the state with the value
   * of the event attribute.
   *
   * @param key {string} the state to update
   * @param attr {string} the event target attribute to use
   * @returns {function(Event)}
   */
  onChange = (key, attr) => {
    return e => {
      const value = e.target[attr];

      this.setState(oldState => ({
        settings: {
          ...oldState.settings,
          [key]: value
        }
      }));
    };
  };

  /**
   * Save changes to preferences
   *
   * @param e the submit event
   */
  saveSettings = e => {
    e.preventDefault();

    const { t } = this.props;

    this.setState({
      alertMessage: t("Processing..."),
      alertType: "info",
      showAlert: true,
      processing: true
    });

    this.updateHandler = makeCancelable(
      api.updatePreferences(this.state.settings)
    );
    this.updateHandler.promise
      .then(() => {
        this.setState({
          alertMessage: t("Successfully saved preferences"),
          alertType: "success",
          showAlert: true,
          processing: false
        });
        this.props.refresh();
      })
      .catch(ignoreCancel)
      .catch(error => {
        let message = "";

        if (error instanceof Error) {
          message = error.message;
        } else {
          // Translate the API's error message
          message = t("API Error: {{error}}", {
            error: t(error.key, error.data)
          });
        }

        this.setState({
          alertMessage: message,
          alertType: "danger",
          showAlert: true,
          processing: false
        });
      });
  };

  hideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { t } = this.props;

    const alert = this.state.showAlert ? (
      <Alert
        message={this.state.alertMessage}
        type={this.state.alertType}
        onClick={this.hideAlert}
      />
    ) : null;

    return (
      <Form onSubmit={this.saveSettings}>
        {alert}
        <FormGroup row>
          <Label for="layout" sm={2}>
            {t("Layout")}
          </Label>
          <Col sm={10}>
            <Input
              id="layout"
              type="select"
              value={this.state.settings.layout}
              onChange={this.onChange("layout", "value")}
            >
              <option value="boxed">{t("Boxed")}</option>
              <option value="traditional">{t("Full")}</option>
            </Input>
          </Col>
        </FormGroup>
        <Button type="submit" disabled={this.state.processing}>
          {t("Apply")}
        </Button>
      </Form>
    );
  }
}

const TranslatedPreferenceSettings = withNamespaces([
  "common",
  "settings",
  "api-errors"
])(PreferenceSettings);

export default () => (
  <PreferencesContext.Consumer>
    {({ settings, refresh }) => (
      <TranslatedPreferenceSettings settings={settings} refresh={refresh} />
    )}
  </PreferencesContext.Consumer>
);
