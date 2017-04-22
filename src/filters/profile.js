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

    // omit the resolution if it has no profiles
    if (filteredProfiles && filteredProfiles.length) {
      results.push({
        resolution: resolution,
        profiles: filteredProfiles
      });
    }
  });

  return { resolutions: results };
}
