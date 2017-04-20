const R = require('ramda');

export default function resolution(resolution, data) {  
   const result = R.filter(
    R.whereEq({
      resolution: resolution     
    }),
    data.resolutions
  );

  return {resolutions: result};
}