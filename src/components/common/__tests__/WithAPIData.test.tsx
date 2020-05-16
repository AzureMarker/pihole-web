/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * WithAPIData component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import {
  WithAPIData,
  WithAPIDataProps,
  WithAPIDataState
} from "../WithAPIData";

const tick = global.tick;
const emptyRender = () => null;
const emptyAPICall = () => Promise.resolve({});

type WithAPIDataWrapper<T> = ShallowWrapper<
  WithAPIDataProps<T>,
  WithAPIDataState<T>,
  WithAPIData<T>
>;

it("should use renderInitial at the start", () => {
  const renderInitial = jest.fn(() => "test");
  const wrapper = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={renderInitial}
      apiCall={emptyAPICall}
      renderOk={emptyRender}
    />
  );

  expect(renderInitial).toHaveBeenCalled();
  expect(wrapper).toHaveText("test");
});

it("should use renderOk after fetching the data", async () => {
  const renderOk = jest.fn(data => data);
  const wrapper = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={() => Promise.resolve("test")}
      renderOk={renderOk}
    />
  );

  // Let the API call resolve
  await tick();

  expect(renderOk).toHaveBeenCalled();
  expect(wrapper).toHaveText("test");
});

it("should cancel the in-flight request when unmounting", () => {
  const renderOk = jest.fn(data => data);
  const apiCall = jest.fn(emptyAPICall);
  const wrapper = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
    />
  );

  wrapper.unmount();

  expect(apiCall).toHaveBeenCalled();
  expect(renderOk).not.toHaveBeenCalled();
  expect(wrapper).not.toHaveText("test");
});

it("should only rerender once if refresh is called twice", async () => {
  let called = false;
  const renderOk = jest.fn((_, refresh) => {
    if (called) return null;
    called = true;
    refresh();
    refresh();
    return null;
  });

  shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={emptyAPICall}
      renderOk={renderOk}
    />
  );

  // Let the two API calls resolve
  await tick();
  await tick();

  expect(renderOk).toHaveBeenCalledTimes(2);
});

it("should ignore cancel errors if the option is enabled", async () => {
  const apiCall = () => Promise.reject({ isCanceled: true });
  const renderOk = jest.fn(emptyRender);
  const renderErr = jest.fn(emptyRender);

  shallow(
    <WithAPIData
      renderErr={renderErr}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: true, interval: 0 }}
    />
  );

  // Let the API call resolve
  await tick();

  // If the request was canceled, neither the Ok nor Err renderers would have
  // been called
  expect(renderErr).not.toHaveBeenCalled();
  expect(renderOk).not.toHaveBeenCalled();
});

it("should throw non-cancel errors when ignoring cancel errors", async () => {
  const error = { test: true };
  const apiCall = () => Promise.reject(error);
  const renderOk = jest.fn(emptyRender);
  const renderErr = jest.fn(() => "test");

  const wrapper: WithAPIDataWrapper<null> = shallow(
    <WithAPIData
      renderErr={renderErr}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: true, interval: 0 }}
    />
  );

  // Let the API call resolve
  await tick();

  expect(renderErr).toHaveBeenCalledWith(error, wrapper.instance().loadData);
  expect(renderOk).not.toHaveBeenCalled();
  expect(wrapper).toHaveText("test");
});

it("should throw cancel errors when not ignoring cancel", async () => {
  const error = { isCanceled: true };
  const apiCall = () => Promise.reject(error);
  const renderOk = jest.fn(emptyRender);
  const renderErr = jest.fn(() => "test");

  const wrapper: WithAPIDataWrapper<null> = shallow(
    <WithAPIData
      renderErr={renderErr}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: false, interval: 0 }}
    />
  );

  // Let the API call resolve
  await tick();

  expect(renderErr).toHaveBeenCalledWith(error, wrapper.instance().loadData);
  expect(renderOk).not.toHaveBeenCalled();
  expect(wrapper).toHaveText("test");
});

it("should clear the data when flushOnUpdate is true and props are changed", async () => {
  const renderInitial = jest.fn(() => "initial");
  const renderOk = jest.fn(() => "ok");
  const apiCall = jest.fn(() => Promise.resolve("test"));
  const wrapper: WithAPIDataWrapper<string> = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={renderInitial}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: true, interval: 0 }}
      flushOnUpdate
    />
  );

  // Let the API call resolve
  await tick();

  expect(apiCall).toBeCalledTimes(1);
  expect(renderInitial).toHaveBeenCalledTimes(1);
  expect(renderOk).toHaveBeenCalledTimes(1);

  // Change the props in a small way
  wrapper.setProps({ repeatOptions: { ignoreCancel: false, interval: 0 } });

  // Let the second API call resolve
  await tick();

  expect(apiCall).toBeCalledTimes(2);
  expect(renderInitial).toHaveBeenCalledTimes(2);
  expect(renderOk).toHaveBeenCalledTimes(3);
});

it("should use the provided data on refresh instead of hitting the API", async () => {
  let refreshTest: ((data: any) => void) | undefined = undefined;
  const renderOk = jest.fn((data, refresh) => {
    refreshTest = refresh;
    return data;
  });
  const apiCall = jest.fn(() => Promise.resolve("test data"));
  const wrapper = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
    />
  );

  // Let the API call resolve
  await tick();

  // Call the refresh function with the new data
  expect(refreshTest).toBeDefined();
  refreshTest!("new data");

  expect(apiCall).toHaveBeenCalledTimes(1);
  expect(renderOk).toHaveBeenCalledTimes(2);
  expect(wrapper).toHaveText("new data");
});

it("should wait for the interval after refreshing with provided data", async () => {
  jest.useFakeTimers();

  let refreshTest: ((data: any) => void) | undefined = undefined;
  const renderOk = jest.fn((data, refresh) => {
    refreshTest = refresh;
    return data;
  });
  const apiCall = jest.fn(() => Promise.resolve("test data"));

  shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: true, interval: 1000 }}
    />
  );

  // Let the API call resolve
  await tick();

  // Call the refresh function with the new data
  expect(refreshTest).toBeDefined();
  refreshTest!("new data");

  // Wait for the interval
  jest.advanceTimersByTime(1000);

  // The API call should have been triggered again
  expect(apiCall).toHaveBeenCalledTimes(2);
});

it("should pass through repeat options", async () => {
  jest.useFakeTimers();

  const wrapper: WithAPIDataWrapper<null> = shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={emptyAPICall}
      renderOk={emptyRender}
      repeatOptions={{ ignoreCancel: true, interval: 1000 }}
    />
  );

  // Let the API call resolve
  await tick();

  expect(setTimeout).toHaveBeenCalledWith(wrapper.instance().loadData, 1000);
});

it("should pass through repeat options after refresh", async () => {
  jest.useFakeTimers();

  let refreshTest: ((data: any) => void) | undefined = undefined;
  const renderOk = jest.fn((data, refresh) => {
    refreshTest = refresh;
    return data;
  });
  const apiCall = jest.fn(() => Promise.resolve("test data"));

  shallow(
    <WithAPIData
      renderErr={emptyRender}
      renderInitial={emptyRender}
      apiCall={apiCall}
      renderOk={renderOk}
      repeatOptions={{ ignoreCancel: true, interval: 1000 }}
    />
  );

  // Let the API call resolve
  await tick();

  // Call the refresh function with the new data
  expect(refreshTest).toBeDefined();
  refreshTest!("new data");

  expect(setTimeout).toHaveBeenCalledTimes(2);
});
