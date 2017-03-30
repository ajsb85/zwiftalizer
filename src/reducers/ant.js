import { SET_ANT_DATA } from '../actions/parse';

function ant(
  state = {
    devices: [],
    searches: null
  },
  action
) {
  switch (action.type) {
    case SET_ANT_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    default:
      return state;
  }
}

export default ant;
