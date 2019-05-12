/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Tests for canceling promises
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { makeCancelable, ignoreCancel } from "../CancelablePromise";

describe("makeCancelable", () => {
  const testValue = "test";
  const testError = "testError";
  const promise = Promise.resolve(testValue);
  const promiseErr = Promise.reject(testError);

  it("passes through promises in the default case", async () => {
    const cancelablePromise = makeCancelable(promise);

    await expect(cancelablePromise.promise).resolves.toEqual(testValue);
  });

  it("passes through errors in the default case", async () => {
    const cancelablePromise = makeCancelable(promiseErr);

    await expect(cancelablePromise.promise).rejects.toEqual(testError);
  });

  it("rejects with cancel error if canceled", async () => {
    const cancelablePromise = makeCancelable(promise);

    cancelablePromise.cancel();

    await expect(cancelablePromise.promise).rejects.toEqual({
      isCanceled: true
    });
  });

  it("calls the repeat function after resolving", async () => {
    jest.useFakeTimers();

    const mockFunction = jest.fn();
    const interval = 1000;
    const cancelablePromise = makeCancelable(promise, {
      interval,
      repeat: mockFunction
    });

    await expect(cancelablePromise.promise).resolves;

    expect(setTimeout).toHaveBeenCalledWith(mockFunction, interval);
  });

  it("calls the repeat function after rejecting", async () => {
    jest.useFakeTimers();

    const mockFunction = jest.fn();
    const interval = 1000;
    const cancelablePromise = makeCancelable(promiseErr, {
      interval,
      repeat: mockFunction
    });

    await expect(cancelablePromise.promise).rejects.toEqual(testError);

    expect(setTimeout).toHaveBeenCalledWith(mockFunction, interval);
  });

  it("clears the timeout if canceled after resolving", async () => {
    jest.useFakeTimers();

    const mockFunction = jest.fn();
    const interval = 1000;
    const cancelablePromise = makeCancelable(promise, {
      interval,
      repeat: mockFunction
    });

    await cancelablePromise.promise;

    cancelablePromise.cancel();

    expect(clearTimeout).toHaveBeenCalled();
  });
});

describe("ignoreCancel", () => {
  it("passes through non-canceled errors", async () => {
    const testError = "test";
    const promise = Promise.reject(testError);

    await expect(promise.catch(ignoreCancel)).rejects.toEqual(testError);
  });

  it("does not pass through canceled errors", async () => {
    const canceledPromise = Promise.reject({ isCanceled: true });

    await expect(canceledPromise.catch(ignoreCancel)).resolves;
  });
});
