import {
  createStore,
  compose,
  applyMiddleware
} from 'redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

export default function configureStore() {

  const initialState = {}

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        // lets us dispatch async functions
        thunkMiddleware,
        loggerMiddleware // neat middleware that logs actions
      ),
      // enables redux chrome dev tools extension
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  return store
}
