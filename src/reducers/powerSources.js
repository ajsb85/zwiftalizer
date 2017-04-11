import {
  SET_POWERSOURCES_DATA  
} from '../actions/powerSources';

function powerSources(
  state = {
    isLoaded: false,    
    data: {},
    dateLastUpdate: null,
    totalRecords: 0
  },
  action
) {
  switch (action.type) {
    case SET_POWERSOURCES_DATA:
      return Object.assign({}, state, {
        isLoaded: true,
        data: action.data.powerSources,
        dateLastUpdate: action.data.dateLastUpdate,
        totalRecords: action.data.totalRecords
      });
   
    default:
      return state;
  }
}

export default powerSources;