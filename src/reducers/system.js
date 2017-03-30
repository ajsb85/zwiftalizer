import { SET_SYSTEM_DATA } from '../actions/parse';

const unknown = '--';

function system(
  state = {
    platform: unknown,
    cpuVendor: unknown,
    cpuDetails: unknown,
    ram: unknown
  },
  action
) {
  switch (action.type) {
    case SET_SYSTEM_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    default:
      return state;
  }
}

export default system;
