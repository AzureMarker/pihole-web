/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * LayoutApplier component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { mount } from "enzyme";
import LayoutApplier from "../LayoutApplier";
import {
  PreferencesContext,
  PreferencesContextType
} from "../context/PreferencesContext";

it("adds box layout CSS when the layout is box", () => {
  const settings: PreferencesContextType = {
    settings: {
      language: "en",
      layout: "boxed"
    },
    refresh: () => {}
  };

  expect(document.body.classList).not.toContain("boxcontainer");
  expect(document.body.classList).not.toContain("background-image");

  mount(
    <PreferencesContext.Provider value={settings}>
      <LayoutApplier />
    </PreferencesContext.Provider>
  );

  expect(document.body.classList).toContain("boxcontainer");
  expect(document.body.classList).toContain("background-image");
});

it("removes box layout CSS when the layout is traditional", () => {
  const settings: PreferencesContextType = {
    settings: {
      language: "en",
      layout: "traditional"
    },
    refresh: () => {}
  };

  document.body.classList.add("boxcontainer", "background-image");

  expect(document.body.classList).toContain("boxcontainer");
  expect(document.body.classList).toContain("background-image");

  mount(
    <PreferencesContext.Provider value={settings}>
      <LayoutApplier />
    </PreferencesContext.Provider>
  );

  expect(document.body.classList).not.toContain("boxcontainer");
  expect(document.body.classList).not.toContain("background-image");
});
