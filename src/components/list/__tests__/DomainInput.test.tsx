/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * DomainInput component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import {
  DomainInputProps,
  DomainInputState,
  DomainInput,
  DomainInputContainer
} from "../DomainInput";
import api from "../../../util/api";
import { isValidDomain } from "../../../util/validate";

type DomainInputWrapper = ShallowWrapper<
  DomainInputProps,
  DomainInputState,
  DomainInput
>;

const defaultProps: DomainInputProps = {
  onEnter: jest.fn(),
  onRefresh: jest.fn(),
  isValid: isValidDomain,
  onValidationError: jest.fn()
};

const renderDomainInput = (
  props: Partial<DomainInputProps> = {}
): DomainInputWrapper => {
  return shallow(
    <DomainInputContainer {...defaultProps} {...props} />
  ).dive() as DomainInputWrapper;
};

it("has a placeholder", () => {
  const placeholder = "placeholder";
  const wrapper = renderDomainInput({ placeholder });

  expect(wrapper.find("input")).toHaveProp("placeholder", placeholder);
});

it("sets state to input", () => {
  const domain = "domain";
  const wrapper = renderDomainInput();

  wrapper.find("input").simulate("change", { target: { value: domain } });

  expect(wrapper.state().domain).toEqual(domain);
});

it("only has one button when not logged in", () => {
  const wrapper = renderDomainInput();

  expect(wrapper.find("button")).toHaveLength(1);
});

it("disables input when not logged in", () => {
  const wrapper = renderDomainInput();

  expect(wrapper.find("input")).toBeDisabled();
});

it("enables input when logged in", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  expect(wrapper.find("input")).not.toBeDisabled();
});

it("calls onRefresh when the refresh button is clicked", () => {
  const onRefresh = jest.fn();
  const wrapper = renderDomainInput({ onRefresh });

  wrapper.find("button").last().simulate("click");

  expect(onRefresh).toHaveBeenCalled();
});

it("has two buttons when logged in", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  expect(wrapper.find("button")).toHaveLength(2);
});

it("does not call onEnter when input is empty", () => {
  api.loggedIn = true;

  const onEnter = jest.fn();
  const wrapper = renderDomainInput({
    onEnter,
    isValid: () => true
  });

  wrapper
    .find("form")
    .first()
    .simulate("submit", { preventDefault: jest.fn() });

  expect(onEnter).not.toHaveBeenCalled();
});

it("calls onEnter when input is not empty", () => {
  api.loggedIn = true;

  const domain = "domain.com";
  const onEnter = jest.fn();
  const wrapper = renderDomainInput({ onEnter });

  wrapper.find("input").simulate("change", { target: { value: domain } });
  wrapper
    .find("form")
    .first()
    .simulate("submit", { preventDefault: jest.fn() });

  expect(onEnter).toHaveBeenCalledWith(domain);
});

it("clears input after clicking add button", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  wrapper.find("input").simulate("change", { target: { value: "domain.com" } });
  wrapper
    .find("form")
    .first()
    .simulate("submit", { preventDefault: jest.fn() });

  expect(wrapper.state().domain).toEqual("");
});

// Tests to check the validation functionality
it("sets state.isValid to true when domain is properly formatted", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  wrapper
    .find("input")
    .simulate("change", { target: { value: "valid.domain" } });
  expect(wrapper.state().domain).toEqual("valid.domain");
  expect(wrapper.state().isValid).toEqual(true);
});

it("sets state.isValid to false when domain is not properly formatted", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  wrapper
    .find("input")
    .simulate("change", { target: { value: "invalid.domain." } });
  expect(wrapper.state().domain).toEqual("invalid.domain.");
  wrapper
    .find("form")
    .first()
    .simulate("submit", { preventDefault: jest.fn() });
  expect(wrapper.state().isValid).toEqual(false);
});

it("sets is-invalid class to the input when domain is not properly formatted", () => {
  api.loggedIn = true;

  const wrapper = renderDomainInput();

  wrapper
    .find("input")
    .simulate("change", { target: { value: "invalid.domain." } });
  wrapper
    .find("form")
    .first()
    .simulate("submit", { preventDefault: jest.fn() });
  expect(wrapper.find("input").hasClass("is-valid")).toBe(false);
  expect(wrapper.find("input").hasClass("is-invalid")).toBe(true);
});
