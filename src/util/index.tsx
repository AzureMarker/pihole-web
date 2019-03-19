/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Various utilities
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { TimeRange } from "../components/common/context/TimeRangeContext";

/**
 * Pad a two digit number
 *
 * @param num the number
 * @returns {string} a padding number string
 */
export const padNumber = (num: number) => {
  return ("00" + num).substr(-2, 2);
};

/**
 * Dynamically calculate a time interval so there are always 144 data points
 * (144 so that every point represents 10 minutes when the range is 24 hours)
 *
 * @param range The range to find the interval for
 */
export const getIntervalForRange = (range: TimeRange): number => {
  return Math.ceil((range.until.unix() - range.from.unix()) / 144);
};

export interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export interface CancelableOptions {
  /**
   * The function to call to repeat the promise
   */
  repeat: () => void;

  /**
   * The amount of time to wait until repeating
   */
  interval: number;
}

/**
 * Make a promise cancelable and repeatable
 *
 * @param promise the promise
 * @param options the interval repeat options
 * @returns {{promise: Promise<T>, cancel(): void}} a handle on the cancelable
 * promise
 */
export function makeCancelable<T>(
  promise: Promise<T>,
  options?: CancelableOptions
): CancelablePromise<T> {
  let hasCanceled = false;
  let repeatId: NodeJS.Timeout | null = null;

  const handle = (
    resolve: (value: any) => void,
    reject: (error: any) => void,
    val: T,
    isError: boolean
  ) => {
    if (hasCanceled) reject({ isCanceled: true });
    else {
      if (isError) reject(val);
      else resolve(val);

      if (options) repeatId = setTimeout(options.repeat, options.interval);
    }
  };

  const wrappedPromise: Promise<T> = new Promise((resolve, reject) => {
    promise.then(
      val => handle(resolve, reject, val, false),
      error => handle(resolve, reject, error, true)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      if (repeatId !== null) {
        clearTimeout(repeatId);
      }
      hasCanceled = true;
    }
  };
}

/**
 * Ignore canceled promises (pass into a promise's catch function)
 *
 * @param err the error from catching the promise
 */
export const ignoreCancel = (err: any) => {
  if (!err.isCanceled) throw err;
};
