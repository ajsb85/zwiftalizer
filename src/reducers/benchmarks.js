import {
  SET_BENCHMARKS_DATA
} from '../actions/benchmarks'

function benchmarks(state = {
  isLoaded: false,
  benchmarks: null
}, action) {

  switch (action.type) {

    case SET_BENCHMARKS_DATA:
      return Object.assign({}, state, {
        isLoaded: true,
        benchmarks: action.data
      })

    default:
      return state
  }

}

export default benchmarks
