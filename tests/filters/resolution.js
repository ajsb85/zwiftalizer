var test = require('tape');

var data = require('../../testdata/benchmarks');

import resolution from '../../src/filters/resolution';

test('should filter to one resolution', assert => {
  const expected = 1;

  const filtered = resolution(1080, data);

  assert.equal(filtered.resolutions.length, expected);

  console.log(filtered);
  
  assert.end();
});
