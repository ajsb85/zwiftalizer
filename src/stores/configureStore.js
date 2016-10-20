import {
  createStore,
  compose,
  applyMiddleware
} from 'redux'

import {
  setUserPreferences,
  getUserPreferences
} from '../actions/preferences'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export default function configureStore() {

  let localStorageUserPreferences = getUserPreferences() || null

  const initialState = {}

  let share = true;

  // if localStorageUserPreferences exists, set share to whatever it was before
  share = localStorageUserPreferences && localStorageUserPreferences.share

  initialState.preferences = {
    share
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
      // window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  return store
}
