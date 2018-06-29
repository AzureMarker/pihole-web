/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Box layout component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { shallow } from 'enzyme';
import BoxedLayoutButton from './BoxedLayoutButton';

it("renders without crashing", () => {
  shallow(<BoxedLayoutButton/>);
});

it("toggles boxed layout", () => {
  const wrapper = shallow(<BoxedLayoutButton/>);

  expect(document.body.classList).not.toContain("boxcontainer");
  expect(document.body.classList).not.toContain("background-image");

  wrapper.find("button").simulate("click");

  expect(document.body.classList).toContain("boxcontainer");
  expect(document.body.classList).toContain("background-image");
});
