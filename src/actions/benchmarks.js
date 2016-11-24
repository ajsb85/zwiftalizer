var request = require('qwest')
var _ = require('underscore')

export const SET_BENCHMARKS_DATA = 'SET_BENCHMARKS_DATA'
export const SET_CURRENT_SYSTEM_BENCHMARK = 'SET_CURRENT_SYSTEM_BENCHMARK'
export const TOGGLE_PROFILE_PANEL = 'TOGGLE_PROFILE_PANEL'

export function load() {

  return dispatch => {
    //request.get('http://data.zwiftalizer.com', null, {
    request.get('testbenchmarks.json', null, {
      cache: false,
      dataType: 'json'
    }).then((xhr, data) => {
      dispatch({
        type: SET_BENCHMARKS_DATA,
        data: {
          ...data
        }
      })
    }).catch((e, xhr, response) => {
      console.log('failed to load benchmarks json')
      console.log(e)
      console.log(xhr)
      console.log(response)
    })
  }
}

export function toggleProfilePanel(panelKey) {

  return dispatch => {

    dispatch({
      type: TOGGLE_PROFILE_PANEL,
      data: {
        'key': panelKey
      }
    })
  }

}
