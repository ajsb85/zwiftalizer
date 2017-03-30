var test = require('tape');
var fs = require('fs');

import { normalize, mapBTLELines, toArray } from '../src/parser';

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/btle.txt', 'utf8'));

test('should extract raw BTLE lines', assert => {
  const actual = mapBTLELines(log);

  const expectedLength = 44;

  console.log(actual.length);

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength);

  assert.end();
});
