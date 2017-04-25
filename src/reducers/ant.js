import {
  SET_ANT_DATA,
  SHOW_UNKNOWN_POWERMETER_MODEL_MODAL
} from '../actions/parse';

function ant(
  state = {
    devices: [],
    searches: null,
    /* don't show the modal that prompts for power meter model name by default */
    showUnknownPowermeterModelModal: false
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
        showUnknownPowermeterModelModal: action.data
      });

    default:
      return state;
  }
}

export default ant;
