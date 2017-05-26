const _ = require('underscore');

import { createStore, compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export function getPreferencesFromLocalStorage() {
  if (!localStorage.preferences) {
    return undefined;
  }

  return JSON.parse(localStorage.preferences);
}

export default function configureStore() {
  const initialState = {};

  let localStoragePreferences = getPreferencesFromLocalStorage() || null;

  // default sharing to the benchmarks is on
  let share = true;

  // default expanded benchmarks panel - none
  let expanded = [];

  let currentSystem = null;

  // retrieve cached objects from previous runs from local storage
  if (localStoragePreferences !== null) {
    if (!_.isUndefined(localStoragePreferences.share)) {
      share = localStoragePreferences.share;
    }

    if (!_.isUndefined(localStoragePreferences.expanded)) {
      expanded = localStoragePreferences.expanded;
    }

    if (!_.isUndefined(localStoragePreferences.currentSystem)) {
      currentSystem = localStoragePreferences.currentSystem;
    }
  }

  initialState.preferences = {
    share: share
  };

  initialState.benchmarks = {
    expanded: expanded,
    currentSystem: currentSystem
  };

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        // lets us dispatch async functions
        thunkMiddleware,
        //loggerMiddleware // neat middleware that logs actions
      ),
      // enables redux chrome dev tools extension
      //window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  return store;
}
