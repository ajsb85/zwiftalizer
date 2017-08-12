import { SET_SELECTED_TAB } from '../actions/tabs';

const initialState = {
  selectedTab: 'tab1'
};

function tabs(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_TAB:
      return Object.assign({}, state, {
        selectedTab: action.tab
      });

    default:
      return state;
  }
}

export default tabs;
