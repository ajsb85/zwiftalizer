var test = require('tape');

import { normalize } from '../src/parser';

test('should normalize line endings', assert => {
  const entries = 'A\r\n' +
    '\r' +
    '\r\n' +
    'B\n' +
    '\r\n' +
    'C\r' +
    '\n' +
    'D\n\n';
  ('\r\n');

  const expected = 'A\nB\nC\nD\n';
  const actual = normalize(entries);

  assert.equal(actual, expected);
  assert.end();
});
