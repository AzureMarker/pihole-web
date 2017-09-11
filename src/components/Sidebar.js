/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Admin Web Interface
*  Sidebar component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */


import React from 'react';
import { NavLink } from 'react-router-dom'
import { Nav, NavItem } from 'reactstrap';
import logo from '../img/logo.svg';
import { mobileSidebarToggle } from "./Header";

const nav = {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-dashboard'
    },
    {
      name: 'Query Log',
      url: '/query-log',
      icon: 'fa fa-database'
    },
    {
      name: 'Whitelist',
      url: '/whitelist',
      icon: 'fa fa-check-square-o'
    },
    {
      name: 'Blacklist',
      icon: 'fa fa-ban',
      children: [
        {
          name: 'Exact',
          url: '/blacklist',
          icon: 'fa fa-ban'
        },
        {
          name: 'Wildcard',
          url: '/wildlist',
          icon: 'fa fa-ban'
        }
      ]
    }
  ]
};

const handleClick = (e) => {
  e.preventDefault();
  e.target.parentElement.classList.toggle('open');
};

const activeRoute = (routeName, props) =>
  props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

const navItem = (item, key) => (
    <NavItem key={key}>
    <NavLink to={item.url} onClick={mobileSidebarToggle} className="nav-link" activeClassName="active">
      <i className={item.icon}/>{item.name}
    </NavLink>
  </NavItem>
);

const navDropdown = (item, key, props) => (
  <li key={key} className={activeRoute(item.url, props)}>
    <a className="nav-link nav-dropdown-toggle" style={{ "cursor": "pointer" }} onClick={handleClick}><i className={item.icon}/>{item.name}</a>
    <ul className="nav-dropdown-items">
      {navList(item.children)}
    </ul>
  </li>
);

const navList = (items, props) =>
  items.map((item, index) => item.children ? navDropdown(item, index, props) : navItem(item, index));

export default props => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <Nav>
          <li className="nav-title">
            <img src={logo} className="img-responsive pull-left" style={{height: "67px"}} alt=""/>
            <p className="pull-left"
               style={{
                 paddingLeft: "15px", textTransform: "initial", fontSize: "14px", marginBottom: "initial",
                 lineHeight: "14px", color: "white"
               }}>
              Pi-hole
            </p>
            <br/>
            <span style={{textTransform: "initial", paddingLeft: "15px"}}>
              <i className="fa fa-circle text-success"/> Online
            </span>
          </li>
          {navList(nav.items, props)}
        </Nav>
      </nav>
    </div>
  )
}
