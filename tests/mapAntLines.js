var test = require('tape');
var fs = require('fs');

import { normalize, mapAntLines, toArray } from '../src/parser';

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'));

test('should extract raw ANT+ lines', assert => {
  const actual = mapAntLines(log);

  const expectedLength = 11303;

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength);

  assert.end();
});
