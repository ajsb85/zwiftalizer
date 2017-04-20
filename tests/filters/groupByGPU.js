var test = require('tape');

var data = require('../../testdata/benchmarks');

import groupByGPU from '../../src/filters/groupByGPU';

const isObject = val => {
  if (val === null) {
    return false;
  }
  return typeof val === 'function' || typeof val === 'object';
};

test('should get benchmarks file', assert => {
  assert.true(isObject(data));
  assert.end();
});

test('should get benchmarks resolutions collection length', assert => {
  const expected = 1;

  const filtered = groupByGPU(data)

  assert.equal(filtered.resolutions.length, expected);

  console.log(filtered);

  assert.end();
});
