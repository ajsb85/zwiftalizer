var test = require('tape');

import { ram } from '../src/parser';

test('should extract RAM size', assert => {
  const entry = '[22:26:55] RAM: 4GB';
  const expected = '4GB';
  const actual = ram(entry);
  assert.equal(actual, expected);
  assert.end();
});
