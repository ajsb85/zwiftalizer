const request = require('qwest');
const _ = require('underscore');

export const SET_POWERSOURCES_DATA = 'SET_POWERSOURCES_DATA';

export function load(callback) {
  return dispatch => {
    request
        .get('https://data.zwiftalizer.com/powerSources.json', null, {
        //.get('testpowersources.json', null, {
        cache: false,
        dataType: 'json'
      })
      .then((xhr, data) => {
        dispatch({
          type: SET_POWERSOURCES_DATA,
          data: {
            ...data
          }
        });

        callback && callback();
      })
      .catch((e, xhr, response) => {
        console.log('failed to load powersources json');
        console.log(e);
        console.log(xhr);
        console.log(response);
      });
  };
}