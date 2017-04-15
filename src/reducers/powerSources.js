import {
  SET_POWERSOURCES_DATA  
} from '../actions/powerSources';

function powerSources(
  state = {
    isLoaded: false,    
    regions: {},
    dateLastUpdate: null,    
  },
  action
) {
  switch (action.type) {
    case SET_POWERSOURCES_DATA:
      return Object.assign({}, state, {
        isLoaded: true,
        data: action.data.data,
        dateLastUpdate: action.data.dateLastUpdate        
      });
   
    default:
      return state;
  }
}

export default powerSources;