/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  DomainInput component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { shallow } from 'enzyme';
import DomainInput from './DomainInput';
import { api } from "../../utils";

it('has a placeholder', () => {
  const placeholder = 'placeholder';
  const wrapper = shallow(<DomainInput placeholder={placeholder} onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  expect(wrapper.find('input')).toHaveProp('placeholder', placeholder);
});

it('sets state to input', () => {
  const domain = "domain";
  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  wrapper.find('input').simulate('change', { target: { value: domain } });

  expect(wrapper.state().domain).toEqual(domain);
});

it('only has one button when not logged in', () => {
  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  expect(wrapper.find('button')).toHaveLength(1);
});

it('disables input when not logged in', () => {
  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  expect(wrapper.find('input')).toBeDisabled();
});

it('enables input when logged in', () => {
  api.loggedIn = true;

  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  expect(wrapper.find('input')).not.toBeDisabled();
});

it('calls onRefresh when the refresh button is clicked', () => {
  const onRefresh = jest.fn();
  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={onRefresh}/>);

  wrapper.find('button').last().simulate('click');

  expect(onRefresh).toHaveBeenCalled();
});

it('has two buttons when logged in', () => {
  api.loggedIn = true;

  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  expect(wrapper.find('button')).toHaveLength(2);
});

it('does not call onEnter when input is empty', () => {
  api.loggedIn = true;

  const onEnter = jest.fn();
  const wrapper = shallow(<DomainInput onEnter={onEnter} onRefresh={jest.fn()}/>);

  wrapper.find('button').first().simulate('click');

  expect(onEnter).not.toHaveBeenCalled();
});

it('calls onEnter when input is not empty', () => {
  api.loggedIn = true;

  const domain = 'domain';
  const onEnter = jest.fn();
  const wrapper = shallow(<DomainInput onEnter={onEnter} onRefresh={jest.fn()}/>);

  wrapper.find('input').simulate('change', { target: { value: domain } });
  wrapper.find('button').first().simulate('click');

  expect(onEnter).toHaveBeenCalledWith(domain);
});

it('clears input after clicking add button', () => {
  api.loggedIn = true;

  const wrapper = shallow(<DomainInput onEnter={jest.fn()} onRefresh={jest.fn()}/>);

  wrapper.find('input').simulate('change', { target: { value: 'domain' } });
  wrapper.find('button').first().simulate('click');

  expect(wrapper.state().domain).toEqual('');
});
