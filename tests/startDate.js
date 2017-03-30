var test = require('tape');
var fs = require('fs');

import { normalize, startDate } from '../src/parser';

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/testlog.txt', 'utf8'));

test('should extract first instance of log date', assert => {
  const expected = '2016-01-12';
  const actual = startDate(log);
  assert.equal(actual, expected, 'actual log date equal expected');
  assert.end();
});
