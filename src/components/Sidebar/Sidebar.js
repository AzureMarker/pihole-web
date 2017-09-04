import React from 'react';
import { NavLink } from 'react-router-dom'
import logo from '../../img/logo.svg';

//const handleClick = (e) => {
//  e.preventDefault();
//  e.target.parentElement.classList.toggle('open');
//};

//const activeRoute = (routeName) => {
//  return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
//}

//const secondLevelActive = (routeName) => {
//  return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
//}

export default () => (
  <div className="sidebar">
    <nav className="sidebar-nav">
      <ul className="nav">
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
        <li className="nav-item">
          <NavLink to={'/dashboard'} className="nav-link" activeClassName="active">
            <i className="fa fa-dashboard"/> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'/query-log'} className="nav-link" activeClassName="active">
            <i className="fa fa-database"/> Query Log
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'/whitelist'} className="nav-link" activeClassName="active">
            <i className="fa fa-check-square-o"/> Whitelist
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'/blacklist'} className="nav-link" activeClassName="active">
            <i className="fa fa-ban"/> Blacklist
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
);
