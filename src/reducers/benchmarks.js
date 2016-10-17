import {
  SET_BENCHMARKS_DATA
} from '../actions/benchmarks'

function benchmarks(state = {
  isLoaded: false,
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

    default:
      return state
  }

}

export default benchmarks
