import {
  FILE_LOADED,
  FILE_LOADING,
  RESET,
  UNABLE_TO_LOAD_FILE
} from '../actions/parse';

function reader(
  state = {
    isLoaded: false,
    isLoading: false,
    isFailure: false
  },
  action
) {
  switch (action.type) {
    case FILE_LOADED:
      return Object.assign({}, state, {
        isLoaded: true,
        isLoading: false,
        isFailure: false
      });

    case FILE_LOADING:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: true,
        isFailure: false
      });

    case RESET:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: false,
        isFailure: false
      });

    case UNABLE_TO_LOAD_FILE:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: false,
        isFailure: true
      });

    default:
      return state;
  }
}

export default reader;
