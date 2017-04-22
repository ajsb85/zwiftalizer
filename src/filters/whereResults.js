const R = require('ramda');

export default function whereResults(predicate, data) {
  if (!data) {
    return {};
  }

  if (!data.resolutions) {
    return data;
  }

  const response = [];

  data.resolutions.map(resolution => {
    if (!resolution.profiles) {
      return [];
    }

    let profiles = [];

    resolution.profiles.map(profile => {
      const filteredResults = R.filter(R.where(predicate))(profile.results);

      // omit the profile if it has no results
      if (filteredResults && filteredResults.length) {
        profiles.push({
          profileId: profile.profileId,
          results: filteredResults
        });
      }
    });

    if (profiles.length) {
      response.push({
        resolution: resolution.resolution,
        profiles: profiles
      });
    }
  });

  return { resolutions: response };
}
