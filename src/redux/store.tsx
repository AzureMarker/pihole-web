/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Configuration of the Redux store
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import {
  configureStore,
  EnhancedStore,
  getDefaultMiddleware
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducers";
import { ReduxState } from "./state";
import { rootSaga } from "./sagas";

/**
 * A Redux store with a function to start the Saga
 */
export interface SagaStore extends EnhancedStore<ReduxState> {
  /**
   * Call this to start running the Sagas
   */
  runSaga: () => void;
}

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  sagaMiddleware,
  // In development, this will include middleware for verifying immutable and
  // serializable state. The thunk middleware is excluded because we are using
  // sagas instead.
  ...getDefaultMiddleware({ thunk: false })
];

const store = configureStore({
  reducer,
  middleware
}) as SagaStore;

store.runSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default store;
