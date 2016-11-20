var request = require('qwest')
var _ = require('underscore')

// export const _2160_3 = '2160-3'
// export const _1440_3 = '1440-3'
// export const _1440_2 = '1440-2'
// export const _1080_3 = '1080-3'
// export const _1080_2 = '1080-2'
// export const _1080_1 = '1080-1'
// export const _1080_0 = '1080-0'
// export const _720_3 = '720-3'
// export const _720_2 = '720-2'
// export const _720_1 = '720-1'
// export const _720_0 = '720-0'
// export const _576_2 = '576-2'
// export const _576_1 = '576-1'
// export const _576_0 = '576-0'

export const SET_BENCHMARKS_DATA = 'SET_BENCHMARKS_DATA'

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
