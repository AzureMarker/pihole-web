import React, { Component } from "react";
import { translate } from "react-i18next";
import { api, makeCancelable, ignoreCancel } from "../../utils";

class StatusBadge extends Component {
  state = {
    status: "enabled"
  };

  updateStatus = () => {
    this.updateHandler = makeCancelable(api.getStatus(), {
      repeat: this.updateStatus,
      interval: 5000
    });
    this.updateHandler.promise
      .then(res => {
        this.setState({ status: res.status });
      })
      .catch(ignoreCancel)
      .catch(() => {
        this.setState({ status: "unknown" });
      });
  };

  componentDidMount() {
    this.updateStatus();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return this.state.status === "enabled" ? (
      <span>
        <i className="fa fa-circle text-success" />
        &nbsp;
        {t("Enabled")}
      </span>
    ) : (
      <span>
        <i className="fa fa-circle text-danger" />
        &nbsp;
        {t("Disabled")}
      </span>
    );
  }
}

export default translate("common")(StatusBadge);
