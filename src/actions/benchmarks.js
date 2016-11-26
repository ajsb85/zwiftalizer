var request = require('qwest')
var _ = require('underscore')

export const SET_BENCHMARKS_DATA = 'SET_BENCHMARKS_DATA'
export const SET_CURRENT_SYSTEM_BENCHMARK = 'SET_CURRENT_SYSTEM_BENCHMARK'
export const TOGGLE_PROFILE_PANEL = 'TOGGLE_PROFILE_PANEL'
export const OPEN_PROFILE_PANEL = 'OPEN_PROFILE_PANEL'
export const RESET_ALL = 'RESET_ALL'

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

export function openProfilePanel(panelKey) {

  return dispatch => {

    dispatch({
      type: OPEN_PROFILE_PANEL,
      data: {
        'key': panelKey
      }
    })
  }

}

export function resetReport() {

  return dispatch => {
    dispatch({
      type: RESET_ALL
    })
  }

}

export function getPerformanceScore(resolution, profileId) {

  if (_.isUndefined(resolution) || _.isUndefined(profileId)) {
    return {
      value: 0,
      label: '--',
      opinion: ''
    }
  }

  const maxScore = 10;

  var opinion = 'Unicorns and rainbows!'

  // a 'score' for the current resolution and profile combination works out as a scale of 3/10 to 10/10
  var value = Math.round(resolution / 395) + profileId + 2;

  // ultra 1080 is pretty awesome, so fudge this one
  if (profileId === 3 && resolution === 1080) {
    value = 9
  }

  if (value <= 8) {
    opinion = 'Sweet spot!'
  }

  if (value <= 5) {
    opinion = 'Gets the job done!'
  }

  const label = value + '/' + maxScore

  return {
    value,
    label,
    opinion
  }
}
