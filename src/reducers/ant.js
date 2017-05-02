import {
  SET_ANT_DATA,
  SET_ANT_DEVICES,
  SHOW_UNKNOWN_POWERMETER_MODEL_MODAL,
  SHOW_UNKNOWN_SMART_TRAINER_MODEL_MODAL
} from '../actions/parse';

function ant(
  state = {
    devices: [],
    searches: null,
    /* don't show the modal that prompts for power meter model name by default */
    showUnknownPowerMeterModelModal: false,

    /* don't show the modal that prompts for smart trainer model name by default */
    showUnknownSmartTrainerModelModal: false,

    /* we can use the length of this array to report how much time was spent */
    /* searching for devices compared to the duration of the activity */
    /* total duration is length * 10 in seconds)
    /* lenght of array is how many times devices had to be paired */
    searchesTimestampsRounded: []
  },
  action
) {
  switch (action.type) {
    case SET_ANT_DATA:
      return Object.assign({}, state, {
        ...action.data
      });

    case SHOW_UNKNOWN_POWERMETER_MODEL_MODAL:
      return Object.assign({}, state, {
        showUnknownPowerMeterModelModal: action.data
      });

    case SHOW_UNKNOWN_SMART_TRAINER_MODEL_MODAL:
      return Object.assign({}, state, {
        showUnknownSmartTrainerModelModal: action.data
      });

    case SET_ANT_DEVICES:
      return Object.assign({}, state, {
        devices: action.data
      });

    default:
      return state;
  }
}

export default ant;
