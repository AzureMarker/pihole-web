import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import api from "../../util/api";
import { WithAPIData } from "./WithAPIData";

class StatusBadge extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired
  };

  render() {
    const { t } = this.props;

    return this.props.status === "enabled" ? (
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

export const TranslatedStatusBadge = translate("common")(StatusBadge);

export default props => (
  <WithAPIData
    apiCall={api.getStatus}
    repeatOptions={{ interval: 5000 }}
    renderInitial={() => <TranslatedStatusBadge status="loading" {...props} />}
    renderOk={data => <TranslatedStatusBadge status={data.status} {...props} />}
    renderErr={() => <TranslatedStatusBadge status="unknown" {...props} />}
  />
);
