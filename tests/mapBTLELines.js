var test = require('tape');
var fs = require('fs');

import { normalize, mapBTLELines, toArray } from '../src/parser';

test('should extract raw Tacx BTLE lines', assert => {
  // path is relative to the root of the project
  const tacxlog = normalize(
    fs.readFileSync('./testdata/tacx-btle.txt', 'utf8')
  );

  const actual = mapBTLELines(tacxlog);

  const expectedLength = 44;

  console.log(actual.length);

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength);

  assert.end();
});

test('should extract raw Kickr BTLE lines', assert => {
  // path is relative to the root of the project
  const kickrlog = normalize(
    fs.readFileSync('./testdata/kickr-btle.txt', 'utf8')
  );

  const actual = mapBTLELines(kickrlog);

  const expectedLength = 3;

  console.log(actual.length);

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength);

  assert.end();
});
