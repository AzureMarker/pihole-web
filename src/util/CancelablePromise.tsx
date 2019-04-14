/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Wrap promises to make them cancelable
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/**
 * Get the base path of the web interface. The API will inject a base element
 * for this purpose, but if the web interface is not hosted by the API, it will
 * fall back to the public URL set by Create React App.
 *
 * @returns The base path to use
 */
export const getBasePath = (): string => {
  const baseElement = document.getElementsByTagName("base")[0];

  if (baseElement) {
    return new URL(baseElement.href).pathname;
  } else {
    return process.env.PUBLIC_URL;
  }
};

/**
 * A promise which can be canceled
 */
export interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

/**
 * The options given to {@link makeCancelable}
 */
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
 * The error thrown when the {@link CancelablePromise} is canceled
 */
export interface CanceledError {
  isCanceled: true;
}

/**
 * Make a promise cancelable and repeatable
 *
 * @param promise the promise
 * @param options the interval repeat options
 * @returns a cancelable promise
 */
export function makeCancelable<T>(
  promise: Promise<T>,
  options?: CancelableOptions
): CancelablePromise<T> {
  let hasCanceled = false;
  let repeatId: NodeJS.Timeout | null = null;

  const handle = (
    resolve: (value: T) => void,
    reject: (error: any) => void,
    val: T,
    isError: boolean
  ) => {
    if (hasCanceled) {
      reject({ isCanceled: true });
      return;
    }

    if (isError) {
      reject(val);
    } else {
      resolve(val);
    }

    if (options) {
      repeatId = setTimeout(options.repeat, options.interval);
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
