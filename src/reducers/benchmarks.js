const _find = require('lodash/find');
const _without = require('lodash/without');
const _cloneDeep = require('lodash/cloneDeep');

import {
  SET_BENCHMARKS_DATA,
  TOGGLE_PROFILE_PANEL,
  OPEN_PROFILE_PANEL,
  SET_CURRENT_SYSTEM_BENCHMARK,
  RESET_ALL
} from '../actions/benchmarks';

function benchmarks(
  state = {
    isLoaded: false,
    expanded: [],
    resolutions: [],
    dateLastUpdate: null,
    totalRecords: 0,
    currentSystem: null
  },
  action
) {
  switch (action.type) {
    case SET_BENCHMARKS_DATA:
      return Object.assign({}, state, {
        isLoaded: true,
        resolutions: action.data.resolutions,
        dateLastUpdate: action.data.dateLastUpdate,
        totalRecords: action.data.totalRecords
      });

    case SET_CURRENT_SYSTEM_BENCHMARK: {
      const currentSystemState = {
        currentSystem: action.data
      };

      const nextState = Object.assign({}, state, currentSystemState);

      // persist the last parsed system to local storage
      // so that we can insert it into the benchmarks again
      // the next time the user browses the benchmarks
      if (!localStorage.preferences) {
        localStorage.preferences = JSON.stringify(currentSystemState);
      } else {
        const preferences = JSON.parse(localStorage.preferences);
        const nextPreferences = Object.assign(
          {},
          preferences,
          currentSystemState
        );
        localStorage.preferences = JSON.stringify(nextPreferences);
      }

      return nextState;
    }
    case TOGGLE_PROFILE_PANEL: {
      let nextState = _cloneDeep(state);

      var alreadyExpanded = _find(state.expanded, function(panel) {
        return panel === action.data.key;
      });

      if (alreadyExpanded) {
        // collapse
        // commented out because we now collapse all panels for better performance
        // nextState.expanded = _without(state.expanded, action.data.key);
        // collapse all panels
        nextState.expanded = [];
      } else {
        // open only one panel at a time for performance reasons
        nextState.expanded = [action.data.key];
        // commented out because we now only allow one panel open at a time
        //nextState.expanded.push(action.data.key);
      }

      const prefs = {
        expanded: nextState.expanded
      };

      if (!localStorage.preferences) {
        localStorage.preferences = JSON.stringify(prefs);
      } else {
        const preferences = JSON.parse(localStorage.preferences);
        const nextPreferences = Object.assign({}, preferences, prefs);
        localStorage.preferences = JSON.stringify(nextPreferences);
      }

      return nextState;
    }

    case OPEN_PROFILE_PANEL: {
      var alreadyExpanded = _find(state.expanded, function(panel) {
        return panel === action.data.key;
      });

      if (alreadyExpanded) {
        return state;
      }

      let nextState = _cloneDeep(state);

      nextState.expanded.push(action.data.key);

      const prefs = {
        expanded: nextState.expanded
      };

      if (!localStorage.preferences) {
        localStorage.preferences = JSON.stringify(prefs);
      } else {
        const preferences = JSON.parse(localStorage.preferences);
        const nextPreferences = Object.assign({}, preferences, prefs);
        localStorage.preferences = JSON.stringify(nextPreferences);
      }

      return nextState;
    }

    case RESET_ALL: {
      const currentSystemState = {
        currentSystem: null,
        expanded: []
      };

      if (!localStorage.preferences) {
        localStorage.preferences = JSON.stringify(currentSystemState);
      } else {
        const preferences = JSON.parse(localStorage.preferences);
        const nextPreferences = Object.assign(
          {},
          preferences,
          currentSystemState
        );
        localStorage.preferences = JSON.stringify(nextPreferences);
      }
    }

    default:
      return state;
  }
}

export default benchmarks;
