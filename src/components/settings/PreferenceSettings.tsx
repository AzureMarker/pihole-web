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
import { WithNamespaces, withNamespaces } from "react-i18next";
import { CancelablePromise, ignoreCancel, makeCancelable } from "../../util";
import api from "../../util/api";
import Alert, { AlertType } from "../common/Alert";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { PreferencesContext } from "../common/context";
import languages from "../../languages.json";
import i18n from "i18next";

export interface PreferenceSettingsProps {
  settings: ApiPreferences;
  refresh: (preferences?: ApiPreferences) => void;
}

export interface PreferenceSettingsState {
  alertMessage: string;
  alertType: AlertType;
  showAlert: boolean;
  processing: boolean;
  settings: ApiPreferences;
}

class PreferenceSettings extends Component<
  PreferenceSettingsProps & WithNamespaces,
  PreferenceSettingsState
> {
  state: PreferenceSettingsState = {
    alertMessage: "",
    alertType: "info",
    showAlert: false,
    processing: false,
    // Initial value is the current settings
    settings: this.props.settings
  };

  private loadHandler: undefined | CancelablePromise<ApiPreferences>;
  private updateHandler: undefined | CancelablePromise<ApiResultResponse>;

  loadPreferences = () => {
    this.loadHandler = makeCancelable(api.getPreferences());
    this.loadHandler.promise
      .then(res => {
        this.setState({ settings: res });
      })
      .catch(ignoreCancel);
  };

  componentDidMount() {
    this.loadPreferences();
  }

  componentWillUnmount() {
    if (this.loadHandler) {
      this.loadHandler.cancel();
    }

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

        // Update the language
        i18n.changeLanguage(this.state.settings.language).then(() =>
          // Once the language is updated, update the alert message to use the
          // new language
          this.setState({ alertMessage: t("Successfully saved preferences") })
        );

        // Update anyone using the preferences
        this.props.refresh(this.state.settings);
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
              {languages.map(language => (
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

const TranslatedPreferenceSettings = withNamespaces([
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
