/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Result class tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { Ok, Err } from "../result";

describe("Ok", () => {
  const testValue = "test";
  const ok = new Ok(testValue);

  it("knows it's Ok", () => {
    expect(ok.isOk()).toBe(true);
    expect(ok.isErr()).toBe(false);
  });

  it("unwraps without error", () => {
    expect(ok.unwrap()).toEqual(testValue);
  });

  it("throws an error on unwrapErr", () => {
    expect(() => ok.unwrapErr()).toThrow("unwrapErr on a Result.Ok");
  });
});

describe("Err", () => {
  const testValue = "test";
  const err = new Err(testValue);

  it("knows it's Err", () => {
    expect(err.isOk()).toBe(false);
    expect(err.isErr()).toBe(true);
  });

  it("throws an error on unwrap", () => {
    expect(() => err.unwrap()).toThrow("unwrap on a Result.Err");
  });

  it("does not throw an error on unwrapErr", () => {
    expect(err.unwrapErr()).toEqual(testValue);
  });
});
