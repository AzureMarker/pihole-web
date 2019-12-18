/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Apply layout saga tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { PayloadAction } from "@reduxjs/toolkit";
import { preferencesSuccess } from "../../actions";
import { testSaga } from "redux-saga-test-plan";
import { applyLayout } from "../applyLayout";

describe("applyLayout", () => {
  it("adds box layout CSS when the layout is box", () => {
    const action: PayloadAction<ApiPreferences> = {
      type: preferencesSuccess.type,
      payload: {
        layout: "boxed",
        language: "en"
      }
    };

    testSaga(applyLayout, action)
      .next()
      .call([document.body.classList, "add"], "boxcontainer")
      .next()
      .call([document.body.classList, "add"], "background-image")
      .next()
      .isDone();
  });

  it("removes box layout CSS when the layout is traditional", () => {
    const action: PayloadAction<ApiPreferences> = {
      type: preferencesSuccess.type,
      payload: {
        layout: "traditional",
        language: "en"
      }
    };

    testSaga(applyLayout, action)
      .next()
      .call([document.body.classList, "remove"], "boxcontainer")
      .next()
      .call([document.body.classList, "remove"], "background-image")
      .next()
      .isDone();
  });
});
