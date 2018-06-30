/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Test Setup
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { api } from "./utils";

// Setup enzyme
configure({ adapter: new Adapter() });

// Mock out react-i18next
jest.mock('react-i18next', () => ({
  // This mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => component => {
    component.defaultProps = { ...component.defaultProps, t: key => key };
    return component;
  },
}));

// Temporary fix to reset logged in state for each test.
// The permanent fix would be to not use a global variable, and instead give this information to components through
// props. Redux would be good for this, if we want to add it to the project.
beforeEach(() => {
  api.loggedIn = false;
});
