var test = require('tape');

import { profile } from '../src/parser';

test('should extract last seen graphics profile', assert => {
  const entries = '[20:23:49] Using low graphics profile\n' +
    '[20:23:50] Using medium graphics profile\n' +
    '[20:23:51] Using high graphics profile\n';

  const expected = 'high';
  const actual = profile(entries);

  assert.equal(actual, expected);
  assert.end();
});
