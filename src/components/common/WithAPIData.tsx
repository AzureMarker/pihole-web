/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * WithAPIData Component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { Component, ReactNode } from "react";
import {
  CancelablePromise,
  ignoreCancel,
  makeCancelable
} from "../../util/CancelablePromise";
import { Err, Ok, Result } from "../../util/result";

export interface WithAPIDataProps<T> {
  apiCall: () => Promise<T>;
  repeatOptions: {
    ignoreCancel: boolean;
    interval: number;
  };

  /**
   * If the data should be cleared when the props update. Defaults to true.
   */
  flushOnUpdate: boolean;

  /**
   * Render the children before the first API request is done
   */
  renderInitial: () => ReactNode;

  /**
   * Render the children if the API request succeeded
   *
   * @param data the data returned from the API call
   * @param refresh a function to trigger an asynchronous data refresh. If a
   *        parameter is given, it will be used as the new API response
   *        instead of hitting the API again.
   */
  renderOk: (data: T, refresh: (data?: T) => void) => ReactNode;

  /**
   * Render the children if the API request failed
   *
   * @param error the error returned from the API call
   * @param refresh a function to trigger an asynchronous data refresh. If a
   *        parameter is given, it will be used as the new API response
   *        instead of hitting the API again.
   */
  renderErr: (error: any, refresh: (data?: T) => void) => ReactNode;
}

export interface WithAPIDataState<T> {
  apiResult: Result<T, any> | null;
}

/**
 * A component for getting API data. It can retrieve information once,
 * periodically, or on call (refresh).
 */
export class WithAPIData<T> extends Component<
  WithAPIDataProps<T>,
  WithAPIDataState<T>
> {
  static defaultProps = {
    repeatOptions: {
      ignoreCancel: true,
      interval: 0
    },
    flushOnUpdate: true
  };

  state: WithAPIDataState<T> = {
    apiResult: null
  };

  private dataHandle: CancelablePromise<T> | undefined;

  loadData = (data?: T) => {
    // Only repeat if there is a non-zero repeat interval
    const cancelOptions =
      this.props.repeatOptions.interval !== 0
        ? {
            repeat: this.loadData,
            interval: this.props.repeatOptions.interval
          }
        : undefined;

    // Clear in-flight or repeating requests so they are not orphaned
    if (this.dataHandle) {
      this.dataHandle.cancel();
    }

    if (data) {
      // Some data was given, it should be used as the API response
      this.setState({ apiResult: new Ok(data) });

      if (cancelOptions) {
        // If the request should be repeated, wait for the interval and then
        // refresh with data from the API
        new Promise(resolve =>
          setTimeout(resolve, cancelOptions.interval)
        ).then(() => this.loadData());
      }
      return;
    }

    // No data was given, make a request to the API
    this.dataHandle = makeCancelable(this.props.apiCall(), cancelOptions);

    this.dataHandle.promise
      .then(data => {
        this.setState({
          apiResult: new Ok(data)
        });
      })
      .catch(error => {
        if (this.props.repeatOptions.ignoreCancel) {
          ignoreCancel(error);
        } else {
          throw error;
        }
      })
      .catch(error => {
        this.setState({
          apiResult: new Err(error)
        });
      });
  };

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    if (this.dataHandle) {
      this.dataHandle.cancel();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<WithAPIDataProps<T>>,
    prevState: Readonly<WithAPIDataState<T>>,
    snapshot?: any
  ): void {
    if (prevProps === this.props) {
      // Don't do anything if the props didn't change
      return;
    }

    if (this.props.flushOnUpdate) {
      // The props changed, so trigger a full reload of the data. Current data is
      // cleared so that loading indicators are shown.
      this.setState({ apiResult: null });
      this.loadData();
    }
  }

  render() {
    if (!this.state.apiResult) {
      return this.props.renderInitial();
    }

    if (this.state.apiResult.isOk()) {
      return this.props.renderOk(this.state.apiResult.unwrap(), this.loadData);
    } else {
      return this.props.renderErr(
        this.state.apiResult.unwrapErr(),
        this.loadData
      );
    }
  }
}
