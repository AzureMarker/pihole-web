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
      add={ignoreAPI}
      refresh={ignoreAPI}
      remove={ignoreAPI}
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
      add={ignoreAPI}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper.find("DomainInput")).toHaveProp("placeholder", placeholder);
});

it("shows the note", () => {
  const note = "My Note";
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note={note}
      add={ignoreAPI}
      refresh={ignoreAPI}
      remove={ignoreAPI}
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
      add={ignoreAPI}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  expect(wrapper.find("Alert")).toHaveLength(0);
});

it("loads domains after mounting", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const wrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={ignoreAPI}
      refresh={() => Promise.resolve(domains)}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  await tick();
  wrapper.update();

  expect(wrapper.find("DomainList")).toHaveProp("domains", domains);
});

it("checks if the domain was already added", async () => {
  const domains = ["domain1", "domain2.com", "domain3.net"];
  const onAlreadyAdded = jest.fn();
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={ignoreAPI}
      refresh={() => Promise.resolve(domains)}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  // Setup with domains (wait for promise to resolve) and mock function
  await tick();
  wrapper.instance().onAlreadyAdded = onAlreadyAdded;
  wrapper.update();

  // Test onEnter
  wrapper.instance().onEnter(domains[0]);

  expect(onAlreadyAdded).toHaveBeenCalledWith(domains[0]);
});

it("calls the add prop when adding a domain", () => {
  const domain = "domain";
  const add = jest.fn(ignoreAPI);
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={add}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);

  expect(add).toHaveBeenCalledWith(domain);
});

it("calls onAdding when adding a domain", () => {
  const domain = "domain";
  const onAdding = jest.fn();
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={ignoreAPI}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onAdding = onAdding;
  wrapper.update();
  wrapper.instance().onEnter(domain);

  expect(onAdding).toHaveBeenCalledWith(domain);
});

it("calls onAdded after API request succeeds", async () => {
  const domain = "domain";
  const onAdded = jest.fn();
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={() => Promise.resolve()}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onAdded = onAdded;
  wrapper.update();
  wrapper.instance().onEnter(domain);
  await tick();

  expect(onAdded).toHaveBeenCalledWith(domain);
});

it("calls onAddFailed after API request fails", async () => {
  const domain = "domain";
  const onAddFailed = jest.fn();
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={() => Promise.reject({})}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onAddFailed = onAddFailed;
  wrapper.update();
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
      add={() => Promise.resolve()}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);
  wrapper.update();
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
      add={() => Promise.reject({})}
      refresh={ignoreAPI}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onEnter(domain);
  wrapper.update();
  await tick();

  expect(wrapper.state().domains).toEqual([]);
});

it("removes the domain when onRemoved is called", async () => {
  const domain = "domain";
  const domains = [domain];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={ignoreAPI}
      refresh={() => Promise.resolve(domains)}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );

  wrapper.instance().onRemoved(domain);
  wrapper.update();

  expect(wrapper.state().domains).toEqual([]);
});

it("resets the domains when removal failed", () => {
  const domain = "domain";
  const domains = [domain];
  const wrapper: ListPageWrapper = shallow(
    <ListPage
      title=""
      placeholder=""
      note=""
      add={ignoreAPI}
      refresh={() => Promise.resolve(domains)}
      remove={ignoreAPI}
      isValid={jest.fn()}
      validationErrorMsg=""
    />
  );
  wrapper.instance().onRemoveFailed(domain, domains);
  wrapper.update();

  expect(wrapper.state().domains).toEqual(domains);
});
