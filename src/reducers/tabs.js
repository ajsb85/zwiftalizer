import { SET_SELECTED_TAB } from '../actions/tabs';

const initialState = {
  tabs1: null,
  tabs2: null,
  tabs3: null,
  tabs4: null,
  tabs5: null
};

function tabs(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_TAB:
      return Object.assign({}, state, {
        [action.namespace]: action.tab
      });

    default:
      return state;
  }
}

export default tabs;
