/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  DomainList component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { shallow } from 'enzyme';
import DomainList from './DomainList';
import { api } from "../utils";

const domains = [
  'domain1.com',
  'domain2.com',
  'domain3.com'
];

it('shows a list of domains', () => {
  const wrapper = shallow(
    <DomainList domains={domains}/>
  );

  expect(wrapper.find('li')).toHaveLength(domains.length);
});

it('shows an alert if there are no domains', () => {
  const wrapper = shallow(
    <DomainList domains={[]}/>
  );

  expect(wrapper.find('li')).toHaveLength(0);
  expect(wrapper.find('ul').childAt(0)).toHaveClassName('alert-info');
  expect(wrapper).toIncludeText('There are no domains in this list');
});

it('does not have a delete button when not signed in', () => {
  const wrapper = shallow(<DomainList domains={domains}/>);

  expect(wrapper.find("ul").childAt(0).find("button")).not.toExist();
});

it('calls onRemoved and API callback when a domain is removed', () => {
  api.loggedIn = true;

  const onRemoved = jest.fn();
  const onFailed = jest.fn();
  const apiCall = jest.fn();
  const wrapper = shallow(
    <DomainList domains={domains} onRemoved={onRemoved} onFailed={onFailed} apiCall={apiCall}/>
  );

  wrapper.find("ul").childAt(0).find("button").simulate("click");

  expect(onRemoved).toHaveBeenCalled();
  expect(apiCall).toHaveBeenCalled();
  expect(onFailed).not.toHaveBeenCalled();
});

it('calls all callbacks when a domain is removed and the API call fails', done => {
  api.loggedIn = true;

  const onRemoved = jest.fn();
  const onFailed = jest.fn();
  const apiCall = jest.fn(() => Promise.reject(new Error()));
  const wrapper = shallow(
    <DomainList domains={domains} onRemoved={onRemoved} onFailed={onFailed} apiCall={apiCall}/>
  );

  wrapper.find("ul").childAt(0).find("button").simulate("click");

  expect(onRemoved).toHaveBeenCalled();
  expect(apiCall).toHaveBeenCalled();

  // Wait until all promises have been resolved before checking if the API promise ran
  setImmediate(() => {
    expect(onFailed).toHaveBeenCalledWith(domains[0], domains);
    done();
  });
});
