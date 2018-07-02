/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: Version Information component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { api, makeCancelable } from '../utils';
import VersionCard from '../components/VersionCard';

class Versions extends Component {
  state = {
    api: {
        branch: "---",
        hash: "---",
        tag: "---"
    },
    core: {
        branch: "---",
        hash: "---",
        tag: "---"
    },
    ftl: {
        branch: "---",
        hash: "---",
        tag: "---"
    },
    web: {
        branch: "---",
        hash: "---",
        tag: "---"
    }
  };

  constructor(props) {
    super(props);
    this.updateVersions = this.updateVersions.bind(this);
  }

  updateVersions() {
    this.updateHandler = makeCancelable(api.getVersion(), { repeat: this.updateVersions, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState(res);
    })
      .catch((err) => {
        if(!err.isCanceled) {
          this.setState({
            api: {
              branch: "-!-",
              hash: "-!-",
              tag: "-!-"
            },
            core: {
              branch: "-!-",
              hash: "-!-",
              tag: "-!-"
            },
            ftl: {
              branch: "-!-",
              hash: "-!-",
              tag: "-!-"
            },
          web: {
              branch: "-!-",
              hash: "-!-",
              tag: "-!-"
              }
          });
        }
      }
    );
  }

  componentDidMount() {
    this.updateVersions();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="row">
        <div className="col-lg-3 col-xs-12">
          <VersionCard name={t("Core")} icon="fa fa-dot-circle-o fa-2x"
                       branch={this.state.core.branch} hash={this.state.core.hash} tag={this.state.core.tag} t={t}/>
        </div>
        <div className="col-lg-3 col-xs-12">
          <VersionCard name={t("FTL")} icon="fa fa-industry fa-2x"
                       branch={this.state.ftl.branch} hash={this.state.ftl.hash} tag={this.state.ftl.tag} t={t}/>
        </div>
        <div className="col-lg-3 col-xs-12">
          <VersionCard name={t("API")} icon="fa fa-bullseye fa-2x"
                       branch={this.state.api.branch} hash={this.state.api.hash} tag={this.state.api.tag} t={t}/>
        </div>
        <div className="col-lg-3 col-xs-12">
          <VersionCard name={t("Web")} icon="fa fa-list-alt fa-2x"
                       branch={this.state.web.branch} hash={this.state.web.hash} tag={this.state.web.tag} t={t}/>
        </div>
      </div>
    );
  }
}

export default translate(['settings'])(Versions);
