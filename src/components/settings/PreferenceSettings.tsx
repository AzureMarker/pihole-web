/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Settings :: Web Interface preferences
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ChangeEvent, Component, FormEvent } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";
import api from "../../util/api";
import Alert, { AlertType } from "../common/Alert";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { PreferencesContext } from "../common/context/PreferencesContext";
import languages from "../../languages.json";
import config from "../../config";

export interface PreferenceSettingsProps {
  settings: ApiPreferences;
  refresh: (preferences?: ApiPreferences) => void;
}

export interface PreferenceSettingsState {
  alertMessage: string;
  alertType: AlertType;
  showAlert: boolean;
  processing: boolean;
  translateMessage: boolean;
  error: { key: string; data: any } | null;
  settings: ApiPreferences;
}

class PreferenceSettings extends Component<
  PreferenceSettingsProps & WithTranslation,
  PreferenceSettingsState
> {
  state: PreferenceSettingsState = {
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    processing: false,
    translateMessage: true,
    error: null,
    // Initial value is the current settings
    settings: this.props.settings
  };

  private updateHandler: undefined | CancelablePromise<ApiSuccessResponse>;

  componentWillUnmount() {
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
  onChange = (key: string, attr: string) => {
    return (e: ChangeEvent) => {
      // @ts-ignore
      const value: string = e.target[attr];

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
  saveSettings = (e: FormEvent) => {
    e.preventDefault();

    this.setState({
      alertMessage: "Processing...",
      error: null,
      alertType: "info",
      showAlert: true,
      processing: true,
      translateMessage: true
    });

    // Allow preference changes when using the fake API
    const apiPromise = config.fakeAPI
      ? Promise.resolve({ status: "success" } as ApiSuccessResponse)
      : api.updatePreferences(this.state.settings);

    this.updateHandler = makeCancelable(apiPromise);
    this.updateHandler.promise
      .then(() => {
        this.setState({
          alertMessage: "Successfully saved preferences",
          alertType: "success",
          showAlert: true,
          processing: false,
          translateMessage: true
        });

        // Update anyone using the preferences
        this.props.refresh(this.state.settings);
      })
      .catch(ignoreCancel)
      .catch(error => {
        let message = "";
        let apiError = null;
        let translateMessage = true;

        if (error instanceof Error) {
          message = error.message;
          translateMessage = false;
        } else {
          message = "API Error: {{error}}";
          apiError = error;
        }

        this.setState({
          alertMessage: message,
          error: apiError,
          alertType: "danger",
          showAlert: true,
          processing: false,
          translateMessage
        });
      });
  };

  hideAlert = () => {
    this.setState({ showAlert: false });
  };

  getAlertMessage = () => {
    const { t } = this.props;

    if (this.state.error) {
      // Translate the API error
      return t(this.state.alertMessage, {
        error: t(this.state.error.key, this.state.error.data)
      });
    } else {
      // Check if the message should be translated
      if (this.state.translateMessage) {
        return t(this.state.alertMessage);
      } else {
        return this.state.alertMessage;
      }
    }
  };

  render() {
    const { t } = this.props;

    const alert = this.state.showAlert ? (
      <Alert
        message={this.getAlertMessage()}
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
        <FormGroup row>
          <Label for="language" sm={2}>
            {t("Language")}
          </Label>
          <Col sm={10}>
            <Input
              id="language"
              type="select"
              value={this.state.settings.language}
              onChange={this.onChange("language", "value")}
            >
              {languages.map((language: string) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
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

const TranslatedPreferenceSettings = withTranslation([
  "common",
  "settings",
  "api-errors",
  "preferences"
])(PreferenceSettings);

export default () => (
  <PreferencesContext.Consumer>
    {({ settings, refresh }) => (
      <TranslatedPreferenceSettings settings={settings} refresh={refresh} />
    )}
  </PreferencesContext.Consumer>
);
