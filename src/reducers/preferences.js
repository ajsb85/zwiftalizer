import {
  SET_PREFERENCES
} from '../actions/preferences'

function preferences(state = {
  share: true,
}, action) {

  switch (action.type) {

    case SET_PREFERENCES:

      const prefs = {
        ...action.data
      }

      if (!localStorage.preferences) {
        localStorage.preferences = JSON.stringify(prefs)
      } else {
        const preferences = JSON.parse(localStorage.preferences)
        let nextPreferences = Object.assign({}, preferences, prefs)
        localStorage.preferences = JSON.stringify(nextPreferences)
      }

      return Object.assign({}, state, prefs)

    default:
      return state
  }
}

export default preferences
