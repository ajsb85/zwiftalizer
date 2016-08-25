import {
  SET_GRAPHICS_DATA
} from '../actions/parse'

const unknown = '--'

function graphics(state = {
  fpsData: [],
  fpsSamples: 0,
  specs: {
    gpuVendor: unknown,
    gpuDetails: unknown,
    openglMajor: unknown,
    openglMinor: unknown,
    profile: unknown,
    resolution: unknown,
    shadowres: unknown
  }
}, action) {

  switch (action.type) {

    case SET_GRAPHICS_DATA:
      return Object.assign({}, state, {
        ...action.data
      })

    default:
      return state
  }

}

export default graphics
