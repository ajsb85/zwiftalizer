import {
  createStore,
  compose,
  applyMiddleware
} from 'redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export function getPreferencesFromLocalStorage() {

  if (!localStorage.preferences) {
    return undefined;
  }

  return JSON.parse(localStorage.preferences)
}

export default function configureStore() {

  const initialState = {}

  let localStoragePreferences = getPreferencesFromLocalStorage() || null

  // default sharing to the benchmarks is on
  let share = true;

  if (localStoragePreferences !== null) {
    share = localStoragePreferences.share
  }

  initialState.preferences = {
    share: share
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        // lets us dispatch async functions
        thunkMiddleware,
        loggerMiddleware // neat middleware that logs actions
      )
      //,
      // enables redux chrome dev tools extension
      //window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  return store
}
