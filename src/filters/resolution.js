const R = require('ramda');

export default function resolution(resolution, data) {
  if (!data) {
    return {};
  }

  if (!data.resolutions) {
    return data;
  }

  const filteredResolutions = R.filter(
    R.whereEq({
      resolution: resolution
    }),
    data.resolutions
  );

  return { resolutions: filteredResolutions };
}
