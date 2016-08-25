import {
  FILE_LOADED,
  FILE_LOADING,
  UPDATE_PROGRESS,
  RESET
} from '../actions/parse'

function reader(state = {
  isLoaded: false,
  isLoading: false
}, action) {

  switch (action.type) {

    case FILE_LOADED:
      return Object.assign({}, state, {
        isLoaded: true,
        isLoading: false
      })

    case FILE_LOADING:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: true
      })

    case RESET:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: false
      })

    default:
      return state
  }

}

export default reader
