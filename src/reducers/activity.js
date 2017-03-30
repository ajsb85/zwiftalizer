import { SET_ACTIVITY_DATA } from '../actions/parse';

const unknown = '--';

function activity(
  state = {
    startDate: unknown,
    startTime: unknown,
    startDateTime: unknown,
    startTimestamp: 0,
    endTimestamp: 0,
    duration: unknown,
    durationFormatted: unknown,
    humanizedDuration: unknown,
    timeAxis: null
  },
  action
) {
  switch (action.type) {
    case SET_ACTIVITY_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    default:
      return state;
  }
}

export default activity;
