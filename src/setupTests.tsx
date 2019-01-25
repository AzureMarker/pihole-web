/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Test Setup
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-enzyme";
import api from "./util/api";
import fetchMock from "fetch-mock";

// Setup enzyme
configure({ adapter: new Adapter() });

// Mock out react-i18next
jest.mock("react-i18next", () => ({
  // This mock makes sure any components using the withNamespaces HoC receive the t function as a prop
  withNamespaces: () => (component: any) => {
    component.defaultProps = {
      ...component.defaultProps,
      t: (key: string) => key
    };
    return component;
  }
}));

// Temporary fix to reset logged in state for each test.
// The permanent fix would be to not use a global variable, and instead give this information to components through
// props. Redux would be good for this, if we want to add it to the project.
beforeEach(() => {
  api.loggedIn = false;
});

// Clear fetch mocks after each test
afterEach(() => {
  fetchMock.restore();
});

// If you await on this function, when you get back control all
// of the promises put in place before it will have executed.
// Use this when waiting for components to handle API responses.
global.tick = () => new Promise(resolve => setImmediate(resolve));

// Use this in place of an API call to have components ignore the call.
// This is useful if you are not testing how it handles the API call, and
// just want the component to act as if it hasn't gotten a response.
global.ignoreAPI = () => Promise.reject({ isCanceled: true });
