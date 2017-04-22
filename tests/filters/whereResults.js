var test = require('tape');
const R = require('ramda');
var data = require('../../testdata/benchmarks');
import whereResults from '../../src/filters/whereResults';

test('should filter to min fps greater than 60 fps', assert => {
  const expectedResolutions = 4;

  const threshold = 60.0;

  const predicate = {
    minFps: R.gte(R.__, threshold)
  };

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    assert.true(r.profiles.length);
    r.profiles.map(p => {
      if (p.results.length) {
        p.results.map(s => {
          assert.true(
            s.minFps >= threshold,
            `min fps: ${s.minFps} >= ${threshold}`
          );
        });
      }
    });
  });

  assert.end();
});

test('should filter to min fps greater than 60 fps and profile is ultra', assert => {
  const expectedResolutions = 3;
  const threshold = 60.0;
  const profileId = 3;

  const predicate = {
    minFps: R.gte(R.__, threshold),
    profileId: R.equals(profileId)
  };

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    assert.true(r.profiles.length);
    r.profiles.map(p => {
      if (p.results.length) {
        p.results.map(s => {
          assert.true(
            s.minFps >= threshold,
            `min fps: ${s.minFps} >= ${threshold}`
          );

          assert.true(
            s.minFps >= threshold,
            `profile ultra: ${s.profileId} === ${profileId}`
          );
        });
      }
    });
  });

  assert.end();
});

test('should filter to avg fps greater than 60 fps', assert => {
  const expectedResolutions = 5;

  const threshold = 60.0;

  const predicate = {
    avgFps: R.gte(R.__, threshold)
  };

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    assert.true(r.profiles.length);
    r.profiles.map(p => {
      if (p.results.length) {
        p.results.map(s => {
          assert.true(
            s.avgFps >= threshold,
            `avg fps: ${s.avgFps} >= ${threshold}`
          );
        });
      }
    });
  });

  assert.end();
});

test('should filter to avg fps greater than 60 fps and min fps greater than 60', assert => {
  const expectedResolutions = 4;

  const threshold = 60.0;

  const predicate = {
    minFps: R.gte(R.__, threshold),
    avgFps: R.gte(R.__, threshold)
  };

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    assert.true(r.profiles.length);
    r.profiles.map(p => {
      if (p.results.length) {
        p.results.map(s => {
          assert.true(
            s.minFps >= threshold,
            `min fps: ${s.minFps} >= ${threshold}`
          );
          assert.true(
            s.avgFps >= threshold,
            `avg fps: ${s.avgFps} >= ${threshold}`
          );
        });
      }
    });
  });

  assert.end();
});

test('should filter to min 60 fps 2160 ultra only', assert => {
  const expectedResolutions = 1;
  const threshold = 60.0;
  const resolution = 2160;
  const profileId = 3;

  const predicate = {
    minFps: R.gte(R.__, threshold),
    profileId: R.equals(profileId),
    resolution: R.equals(resolution)
  };

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  assert.true(filtered.resolutions[0].profiles.length);

  filtered.resolutions[0].profiles.map(p => {
    if (p.results.length) {
      p.results.map(s => {
        assert.true(
          s.profileId === profileId,
          `profileIds: ${s.profileId} >= ${profileId}`
        );

        assert.true(
          s.resolution === resolution,
          `resolution: ${s.resolution} === ${resolution}`
        );

        assert.true(
          s.minFps >= threshold,
          `min fps: ${s.minFps} >= ${threshold}`
        );
      });
    }
  });

  assert.end();
});

