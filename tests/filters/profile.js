const R = require('ramda');
var test = require('tape');
var data = require('../../testdata/benchmarks');
import resolution from '../../src/filters/resolution';
import profile from '../../src/filters/profile';

test('should filter to ultra profiles, removing any resolutions that have no profiles after filtering ', assert => {
  const expectedResolutions = 4; /* should not expect ultra at 576 */
  const profileId = 3;
  const filtered = profile(profileId, data);

  assert.equal(filtered.resolutions.length, expectedResolutions);

  filtered.resolutions.map(r => {
    assert.equal(r.profiles.length, 1);
    assert.equal(r.profiles[0].profileId, profileId); 
  })

  assert.end();
});


test('should filter to ultra res and profile', assert => {
  const expected = 1;
  const filtered = profile(3, resolution(2160, data));
  //console.log(JSON.stringify(filtered));
  assert.equal(filtered.resolutions.length, expected);
  assert.end();
});

test('should filter to high res, ultra profile', assert => {
  const expected = 1;
  const filtered = profile(3, resolution(1080, data));
  //console.log(JSON.stringify(filtered));
  assert.equal(filtered.resolutions.length, expected);
  assert.end();
});
