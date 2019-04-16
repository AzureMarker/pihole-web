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
import DomainInput from "../DomainInput";
import DomainList from "../DomainList";

const ignoreAPI = global.ignoreAPI;
const tick = global.tick;

type ListPageWrapper = ShallowWrapper<
  ListPageProps,
  ListPageState,
  ListPageType
>;

it("shows the title", () => {
  const title = "My Title";
  const wrapper = shallow(
    <ListPage
      title={title}
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper.find("h2")).toHaveText(title);
});

it("shows the placeholder", () => {
  const placeholder = "My Placeholder";
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder={placeholder}
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper.find(DomainInput)).toHaveProp("placeholder", placeholder);
});

it("shows the note", () => {
  const note = "My Note";
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note={note}
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper).toIncludeText(note);
});

it("starts with no alerts shown", () => {
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper.find(Alert)).toHaveLength(0);
});

it("hides the alert if closed", () => {
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  // Show an error message
  wrapper.instance().onAlreadyAdded("domain");

  // Now the alert is shown
  const alert = wrapper.find(Alert);
  expect(alert).toHaveLength(1);

  // Hide the alert
  alert.props().onClick();

  expect(wrapper.find(Alert)).toHaveLength(0);
});

it("cancels requests when un-mounting", async () => {
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(["domain"])}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

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
  const validationError = "test message";
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg={validationError}
    />
  );

  wrapper
    .find(DomainInput)
    .props()
    .onValidationError();

  const alert = wrapper.find(Alert);
  expect(alert).toHaveLength(1);
  expect(alert.props().message).toEqual(validationError);
  expect(alert.props().type).toEqual("danger");
});

it("loads domains after mounting", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(domains)}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  await tick();

  expect(wrapper.find(DomainList)).toHaveProp("domains", domains);
});

it("checks if the domain was already added", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(domains)}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );
  const onAlreadyAdded = jest.spyOn(wrapper.instance(), "onAlreadyAdded");

  // Setup with domains (wait for promise to resolve)
  await tick();

  wrapper.instance().onEnter(domains[0]);

  expect(onAlreadyAdded).toHaveBeenCalledWith(domains[0]);
});

it("calls the add prop when adding a domain", () => {
  const domain = "domain";
  const onAdd = jest.fn(ignoreAPI);
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={onAdd}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);

  expect(onAdd).toHaveBeenCalledWith(domain);
});

it("calls onAdding when adding a domain", () => {
  const domain = "domain";
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );
  const onAdding = jest.spyOn(wrapper.instance(), "onAdding");

  wrapper.instance().onEnter(domain);

  expect(onAdding).toHaveBeenCalledWith(domain);
});

it("calls onAdded after API request succeeds", async () => {
  const domain = "domain";
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={() => Promise.resolve()}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );
  const onAdded = jest.spyOn(wrapper.instance(), "onAdded");

  wrapper.instance().onEnter(domain);
  await tick();

  expect(onAdded).toHaveBeenCalledWith(domain);
});

it("calls onAddFailed after API request fails", async () => {
  const domain = "domain";
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={() => Promise.reject({})}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );
  const onAddFailed = jest.spyOn(wrapper.instance(), "onAddFailed");

  wrapper.instance().onEnter(domain);
  await tick();

  expect(onAddFailed).toHaveBeenCalledWith(domain, []);
});

it("adds the domain in onAdded", async () => {
  const domain = "domain";
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={() => Promise.resolve()}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);
  await tick();

  expect(wrapper.state().domains).toEqual([domain]);
});

it("resets the domains when adding failed", async () => {
  const domain = "domain";
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={() => Promise.reject({})}
      onRefresh={ignoreAPI}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);
  await tick();

  expect(wrapper.state().domains).toEqual([]);
});

it("does not remove the domain if it is not present", async () => {
  const domain = "domain1";
  const domains = ["domain2"];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(domains)}
      onRemove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  await tick();
  wrapper.instance().onRemove(domain);

  expect(wrapper.state().domains).toEqual(domains);
});

it("removes the domain from state when onRemove is called", async () => {
  const domain = "domain";
  const domain2 = "domain2";
  const domains = [domain, domain2];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(domains)}
      onRemove={() => Promise.resolve()}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  await tick();
  wrapper.instance().onRemove(domain);

  expect(wrapper.state().domains).toEqual([domain2]);
});

it("resets the domains when removal failed", async () => {
  const domain = "domain";
  const domains = [domain];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      onAdd={ignoreAPI}
      onRefresh={() => Promise.resolve(domains)}
      onRemove={() => Promise.reject()}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  await tick();
  wrapper.instance().onRemove(domain);
  await tick();

  expect(wrapper.state().domains).toEqual(domains);
});
