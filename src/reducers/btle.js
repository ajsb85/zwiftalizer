import { SET_BTLE_DATA } from '../actions/parse';

function btle(
  state = {
    messages: null
  },
  action
) {
  switch (action.type) {
    case SET_BTLE_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    default:
      return state;
  }
}

export default btle;
