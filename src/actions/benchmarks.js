var request = require('qwest')
var _ = require('underscore')

export const SET_BENCHMARKS_DATA = 'SET_BENCHMARKS_DATA'

export function load() {

  console.log('load')

  return dispatch => {
    request.get('testbenchmarks.json', null, {
      cache: false,
      dataType: 'json'
    }).then((xhr, data) => {

      dispatch({
        type: SET_BENCHMARKS_DATA,
        data: {
          data
        }
      })

    })
  }
}
