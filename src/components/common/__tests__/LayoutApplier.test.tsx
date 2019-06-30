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
import { shallow } from "enzyme";
import {
  LayoutApplier,
  LayoutApplierProps,
  mapStateToProps
} from "../LayoutApplier";
import { ReduxState } from "../../../redux/state";

describe("LayoutApplier", () => {
  describe("mapStateToProps", () => {
    it("should get the layout from the preferences", () => {
      const state: ReduxState = {
        preferences: {
          layout: "boxed",
          language: "en"
        }
      };

      const expectedProps: LayoutApplierProps = {
        layout: "boxed"
      };

      expect(mapStateToProps(state)).toEqual(expectedProps);
    });
  });

  it("adds box layout CSS when the layout is box", () => {
    expect(document.body.classList).not.toContain("boxcontainer");
    expect(document.body.classList).not.toContain("background-image");

    shallow(<LayoutApplier layout="boxed" />);

    expect(document.body.classList).toContain("boxcontainer");
    expect(document.body.classList).toContain("background-image");
  });

  it("removes box layout CSS when the layout is traditional", () => {
    document.body.classList.add("boxcontainer", "background-image");

    expect(document.body.classList).toContain("boxcontainer");
    expect(document.body.classList).toContain("background-image");

    shallow(<LayoutApplier layout="traditional" />);

    expect(document.body.classList).not.toContain("boxcontainer");
    expect(document.body.classList).not.toContain("background-image");
  });
});
