import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <div className="pull-right hidden-xs">
          <b>Pi-hole Version </b> <span id="piholeVersion">vDev </span>
          <b>Web Interface Version </b> <span id="webVersion">vDev</span>
        </div>
        <div>
          <i className="fa fa-github"/> <strong>
          <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=3J2L3Z4DHW9UY">
            Donate
          </a></strong> if you found this useful
        </div>
      </footer>
    )
  }
}

export default Footer;
