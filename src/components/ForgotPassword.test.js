/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  ForgotPassword component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { shallow } from 'enzyme';
import ForgotPassword from "./ForgotPassword";

it('collapses and displays normal if there is no error', () => {
  const wrapper = shallow(<ForgotPassword error={false}/>);

  expect(wrapper.childAt(0)).toHaveClassName('border-primary');
  expect(wrapper.childAt(0).childAt(0)).toHaveClassName('bg-primary');
  expect(wrapper.childAt(0).children().last()).toHaveClassName('collapse');
});

it('expands and displays red if there is an error', () => {
  const wrapper = shallow(<ForgotPassword error={true}/>);

  expect(wrapper.childAt(0)).toHaveClassName('border-danger');
  expect(wrapper.childAt(0).childAt(0)).toHaveClassName('bg-danger');
  expect(wrapper.childAt(0).children().last()).not.toHaveClassName('collapse');
});

it('expands and collapses if clicked without error', () => {
  const wrapper = shallow(<ForgotPassword error={false}/>);

  wrapper.find('button').simulate('click');
  expect(wrapper.childAt(0).children().last()).not.toHaveClassName('collapse');

  wrapper.find('button').simulate('click');
  expect(wrapper.childAt(0).children().last()).toHaveClassName('collapse');
});

it('does not collapse if clicked with error', () => {
  const wrapper = shallow(<ForgotPassword error={true}/>);

  wrapper.find('button').simulate('click');
  expect(wrapper.childAt(0).children().last()).not.toHaveClassName('collapse');
});
