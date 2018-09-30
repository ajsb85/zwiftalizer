import { SET_NETWORK_DATA } from '../actions/parse';

function network(
  state = {
    reconnects: null,
    errors: null,
    phoneConnectionAttempts: null,
    latencyTests: null
  },
  action
) {
  switch (action.type) {
    case SET_NETWORK_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    default:
      return state;
  }
}

export default network;
