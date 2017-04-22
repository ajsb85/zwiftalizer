var test = require('tape');
var data = require('../../testdata/benchmarks');
import whereResults from '../../src/filters/whereResults';

test('should filter to min fps greater than 60 fps', assert => {
  const expectedResolutions = 4;

  const threshold = 60;
  const isGte = n => n >= threshold;

  const predicate = {
    minFps: isGte
  }

  const filtered = whereResults(predicate, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    //console.log(r.resolution.resolution);
    //console.log(r.resolution.profiles.length);
    
    assert.true(r.resolution.profiles.length);

    r.resolution.profiles.map(p => {
      if (p.results.length) {
        p.results.map(s => {
          assert.true(s.minFps >= threshold, `min fps: ${s.minFps} >= ${threshold}`);
        })
      }

    })

  })

  assert.end();
});
