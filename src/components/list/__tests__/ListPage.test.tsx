/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * ListPage component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ListPage, {
  ListPage as ListPageType,
  ListPageProps,
  ListPageState
} from "../ListPage";
import Alert from "../../common/Alert";
import { DomainInputContainer } from "../DomainInput";
import DomainList from "../DomainList";

const ignoreAPI = global.ignoreAPI;
const tick = global.tick;

type ListPageWrapper = ShallowWrapper<
  ListPageProps,
  ListPageState,
  ListPageType
>;

const defaultProps: ListPageProps = {
  title: "",
  placeholder: "",
  note: "",
  onAdd: ignoreAPI,
  onRefresh: ignoreAPI,
  onRemove: ignoreAPI,
  isValid: jest.fn(),
  validationErrorMsg: ""
};

const renderListPage = (
  props: Partial<ListPageProps> = {}
): ListPageWrapper => {
  return shallow(
    <ListPage {...defaultProps} {...props} />
  ).dive() as ListPageWrapper;
};

it("shows the title", () => {
  const title = "My Title";
  const wrapper = renderListPage({ title });

  expect(wrapper.find("h2")).toHaveText(title);
});

it("shows the placeholder", () => {
  const placeholder = "My Placeholder";
  const wrapper = renderListPage({ placeholder });

  expect(wrapper.find(DomainInputContainer)).toHaveProp(
    "placeholder",
    placeholder
  );
});

it("shows the note", () => {
  const note = "My Note";
  const wrapper = renderListPage({ note });

  expect(wrapper).toIncludeText(note);
});

it("starts with no alerts shown", () => {
  const wrapper = renderListPage();

  expect(wrapper.find(Alert)).not.toExist();
});

it("hides the alert if closed", () => {
  const wrapper = renderListPage();

  // Show an error message
  wrapper.instance().onAlreadyAdded("domain");

  // Now the alert is shown
  const alert = wrapper.find(Alert);
  expect(alert).toExist();

  // Hide the alert
  alert.props().onClick();

  expect(wrapper.find(Alert)).not.toExist();
});

it("cancels requests when un-mounting", async () => {
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(["domain"])
  });

  // Load the domains into state
  await tick();

  // Initiate requests to refresh, add, and remove domains
  wrapper.instance().onRefresh();
  wrapper.instance().onEnter("domain2");
  wrapper.instance().onRemove("domain");

  // Spy on the handlers
  // Casting instance to any to access private fields
  const instance = wrapper.instance() as any;
  const cancelRefreshSpy = jest.spyOn(instance.refreshHandler, "cancel");
  const cancelAddSpy = jest.spyOn(instance.addHandler, "cancel");
  const cancelRemoveSpy = jest.spyOn(instance.removeHandler, "cancel");

  // Unmount, which should cancel the requests
  wrapper.unmount();

  expect(cancelRefreshSpy).toHaveBeenCalled();
  expect(cancelAddSpy).toHaveBeenCalled();
  expect(cancelRemoveSpy).toHaveBeenCalled();
});

it("shows a validation message as an error", () => {
  const validationErrorMsg = "test message";
  const wrapper = renderListPage({ validationErrorMsg });

  wrapper.find(DomainInputContainer).props().onValidationError();

  const alert = wrapper.find(Alert);
  expect(alert).toExist();
  expect(alert.props().message).toEqual(validationErrorMsg);
  expect(alert.props().type).toEqual("danger");
});

it("loads domains after mounting", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(domains)
  });

  await tick();

  expect(wrapper.find(DomainList)).toHaveProp("domains", domains);
});

it("checks if the domain was already added", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(domains)
  });
  const onAlreadyAdded = jest.spyOn(wrapper.instance(), "onAlreadyAdded");

  // Setup with domains (wait for promise to resolve)
  await tick();

  wrapper.instance().onEnter(domains[0]);

  expect(onAlreadyAdded).toHaveBeenCalledWith(domains[0]);
});

it("calls the add prop when adding a domain", () => {
  const domain = "domain";
  const onAdd = jest.fn(ignoreAPI);
  const wrapper = renderListPage({ onAdd });

  wrapper.instance().onEnter(domain);

  expect(onAdd).toHaveBeenCalledWith(domain);
});

it("calls onAdding when adding a domain", () => {
  const domain = "domain";
  const wrapper = renderListPage();
  const onAdding = jest.spyOn(wrapper.instance(), "onAdding");

  wrapper.instance().onEnter(domain);

  expect(onAdding).toHaveBeenCalledWith(domain);
});

it("calls onAdded after API request succeeds", async () => {
  const domain = "domain";
  const wrapper = renderListPage({
    onAdd: () => Promise.resolve()
  });
  const onAdded = jest.spyOn(wrapper.instance(), "onAdded");

  wrapper.instance().onEnter(domain);
  await tick();

  expect(onAdded).toHaveBeenCalledWith(domain);
});

it("calls onAddFailed after API request fails", async () => {
  const domain = "domain";
  const wrapper = renderListPage({
    onAdd: () => Promise.reject({})
  });
  const onAddFailed = jest.spyOn(wrapper.instance(), "onAddFailed");

  wrapper.instance().onEnter(domain);
  await tick();

  expect(onAddFailed).toHaveBeenCalledWith(domain, []);
});

it("adds the domain in onAdded", async () => {
  const domain = "domain";
  const wrapper = renderListPage({
    onAdd: () => Promise.resolve()
  });

  wrapper.instance().onEnter(domain);
  await tick();

  expect(wrapper.state().domains).toEqual([domain]);
});

it("resets the domains when adding failed", async () => {
  const domain = "domain";
  const wrapper = renderListPage({
    onAdd: () => Promise.reject({})
  });

  wrapper.instance().onEnter(domain);
  await tick();

  expect(wrapper.state().domains).toEqual([]);
});

it("does not remove the domain if it is not present", async () => {
  const domain = "domain1";
  const domains = ["domain2"];
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(domains)
  });

  await tick();
  wrapper.instance().onRemove(domain);

  expect(wrapper.state().domains).toEqual(domains);
});

it("removes the domain from state when onRemove is called", async () => {
  const domain = "domain";
  const domain2 = "domain2";
  const domains = [domain, domain2];
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(domains),
    onRemove: () => Promise.resolve()
  });

  await tick();
  wrapper.instance().onRemove(domain);

  expect(wrapper.state().domains).toEqual([domain2]);
});

it("resets the domains when removal failed", async () => {
  const domain = "domain";
  const domains = [domain];
  const wrapper = renderListPage({
    onRefresh: () => Promise.resolve(domains),
    onRemove: () => Promise.reject()
  });

  await tick();
  wrapper.instance().onRemove(domain);
  await tick();

  expect(wrapper.state().domains).toEqual(domains);
});
