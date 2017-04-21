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
  const expected = 5;

  const filtered = groupByGPU(data)
  
  console.log(filtered);

  assert.equal(filtered.resolutions.length, expected);

  assert.end();
});
