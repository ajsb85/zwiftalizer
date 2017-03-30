var test = require('tape');

import { lineCount } from '../src/parser';

test('should get the number of lines after splitting the string into lines', assert => {
  const entries = 'A B C\nD E F\nH I J\nK L M\n';
  const expected = 4;
  const actual = lineCount(entries);
  assert.equal(actual, expected);
  assert.end();
});
