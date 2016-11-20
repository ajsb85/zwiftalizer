const _find = require('lodash/find')
const _without = require('lodash/without')
const _cloneDeep = require('lodash/cloneDeep')

import {
  SET_BENCHMARKS_DATA,
  TOGGLE_PROFILE_PANEL
} from '../actions/benchmarks'

function benchmarks(state = {
  isLoaded: false,
  expanded: [],
  resolutions: [],
  dateLastUpdate: null,
  totalRecords: 0
}, action) {

  switch (action.type) {

    case SET_BENCHMARKS_DATA:
      return Object.assign({}, state, {
        isLoaded: true,
        resolutions: action.data.resolutions,
        dateLastUpdate: action.data.dateLastUpdate,
        totalRecords: action.data.totalRecords
      })

    case TOGGLE_PROFILE_PANEL:

      let nextState = _cloneDeep(state)

      var alreadyExpanded = _find(state.expanded, function(panel) {
        return panel === action.data.key
      })

      if (alreadyExpanded) {
        // collapse
        nextState.expanded = _without(state.expanded, action.data.key)
      } else {
        nextState.expanded.push(action.data.key)
      }

      return nextState

    default:
      return state
  }

}

export default benchmarks
