/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Result types
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/**
 * A type which can be either Ok or Err, with some associated data.
 */
export interface Result<T, E> {
  isOk(): boolean;
  isErr(): boolean;
  unwrap(): T;
  unwrapErr(): E;
}

export class Ok<T, E> implements Result<T, E> {
  constructor(private value: T) {}

  isErr(): boolean {
    return false;
  }

  isOk(): boolean {
    return true;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): E {
    throw Error("unwrapErr on a Result.Ok");
  }
}

export class Err<T, E> implements Result<T, E> {
  constructor(private err: E) {}

  isErr(): boolean {
    return true;
  }

  isOk(): boolean {
    return false;
  }

  unwrap(): T {
    throw Error("unwrap on a Result.Err");
  }

  unwrapErr(): E {
    return this.err;
  }
}
