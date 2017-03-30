var test = require('tape');
var fs = require('fs');

import { normalize, stripFpsLines, toArray } from '../src/parser';

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'));

test('should remove raw fps lines from log', assert => {
  const lineCountBefore = toArray(log).length;

  const logWithoutFpsLines = normalize(stripFpsLines(log));

  const lineCountAfter = toArray(logWithoutFpsLines).length;

  const expectedFewerLines = 491;

  assert.true(lineCountBefore - lineCountAfter === expectedFewerLines);

  assert.end();
});
