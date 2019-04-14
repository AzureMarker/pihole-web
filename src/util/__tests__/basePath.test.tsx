/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Tests for base path function
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { getBasePath } from "../basePath";

it("should return the public URL when there is no base", () => {
  const publicUrl = process.env.PUBLIC_URL;

  const basePath = getBasePath();

  expect(basePath).toEqual(publicUrl);
});

it("should return the path from the base element when it exists", () => {
  const expectedBasePath = "/admin";
  const baseElement = document.createElement("base");
  baseElement.href = expectedBasePath;
  document.head.appendChild(baseElement);

  const actualBasePath = getBasePath();

  document.head.removeChild(baseElement);
  expect(actualBasePath).toEqual(expectedBasePath);
});
