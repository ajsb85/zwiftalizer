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

        let results = []

        resolution.profiles.map(profile => {
            const filteredResults =
                R.filter(
                    R.where(predicate),
                    profile.results
                );

            // omit the profile if it has no results
            if (filteredResults && filteredResults.length) {
                results.push({
                    profile: profile.profileId,
                    results: filteredResults
                });
            }
        });

        if (results.length) {
            response.push({
                resolution,
                results
            });
        }
    });

    return { resolutions: response };
}
