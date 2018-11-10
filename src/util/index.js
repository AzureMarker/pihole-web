/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Various utilities
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

/**
 * Pad a two digit number
 *
 * @param num the number
 * @returns {string} a padding number string
 */
export const padNumber = num => {
  return ("00" + num).substr(-2, 2);
};

/**
 * Make a promise cancelable and repeatable
 *
 * @param promise the promise
 * @param repeat the function to call to repeat the promise
 * @param interval the amount of time to wait until repeating
 * @returns {{promise: Promise<any>, cancel(): void}} a handle on the cancelable
 * promise
 */
export const makeCancelable = (
  promise,
  { repeat = null, interval = 0 } = {}
) => {
  let hasCanceled = false;
  let repeatId = null;

  const handle = (resolve, reject, val, isError) => {
    if (hasCanceled) reject({ isCanceled: true });
    else {
      if (isError) reject(val);
      else resolve(val);

      if (repeat) repeatId = setTimeout(repeat, interval);
    }
  };

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => handle(resolve, reject, val, false),
      error => handle(resolve, reject, error, true)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      clearTimeout(repeatId);
      hasCanceled = true;
    }
  };
};

/**
 * Ignore canceled promises (pass into a promise's catch function)
 *
 * @param err the error from catching the promise
 */
export const ignoreCancel = err => {
  if (!err.isCanceled) throw err;
};

/**
 * A result type, similar to Rust's Result.
 * A result can either be Ok or Err
 */
export const Result = {
  /**
   * Create a new Ok Result
   *
   * @param value the value of the result
   */
  Ok: value => ({ type: "Ok", value }),

  /**
   * Create a new Err Result
   *
   * @param value the value of the result (error)
   */
  Err: value => ({ type: "Err", value }),

  /**
   * Check if the result is Ok
   * @param result the result
   * @returns {boolean} if it is an Ok result
   */
  isOk: result => result.type === "Ok",

  /**
   * Check if the result is Err
   * @param result the result
   * @returns {boolean} if it is an Err result
   */
  isErr: result => result.type === "Err"
};
