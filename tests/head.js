var test = require('tape');
var fs = require('fs');

import { head } from '../src/parser';

// path is relative to the root of the project
const log = fs.readFileSync('./testdata/sample.txt', 'utf8');

const shortlog = fs.readFileSync('./testdata/testlog.txt', 'utf8');

test('should extract head with default length', assert => {
  const expected = Math.pow(2, 16);
  const actual = head(log);
  assert.equal(actual.length, expected);
  assert.end();
});

test('should extract head with length specified', assert => {
  const len = Math.pow(2, 11);
  const expected = len;
  const actual = head(log, len);
  assert.equal(actual.length, expected);
  assert.end();
});

test('result should not exceed contents when len is longer than content length', assert => {
  const expected = shortlog.length;
  const actual = head(shortlog);
  assert.equal(actual.length, expected);
  assert.end();
});
