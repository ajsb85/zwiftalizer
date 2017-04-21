const R = require('ramda');

export default function resolution(profile, data) {
  if (!data) {
    return {};
  }

  if (!data.resolutions) {
    return data;
  }

  const results = [];

  data.resolutions.map(resolution => {
    if (!resolution.profiles) {
      return [];
    }

    const filteredProfiles = R.filter(
      R.whereEq({
        profileId: profile
      }),
      resolution.profiles
    );

    results.push({
      resolution: resolution,
      profiles: filteredProfiles
    });
  });

  return { resolutions: results };
}
