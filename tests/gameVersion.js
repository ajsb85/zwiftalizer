import { gameVersion } from '../src/parser';

const test = require('tape');

test('should extract game version', assert => {
  const entry = '[14:47:01] Game Version: 1.0.17782';
  const expected = '1.0.17782';
  const actual = gameVersion(entry);
  assert.equal(actual, expected);
  assert.end();
});
