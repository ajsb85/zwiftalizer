import {
  SET_PREFERENCES
} from '../actions/preferences'

function preferences(state = {
  share: true,
}, action) {

  switch (action.type) {

    case SET_PREFERENCES:
      return Object.assign({}, state, {
        ...action.data
      })

    default:
      return state
  }
}

export default preferences
