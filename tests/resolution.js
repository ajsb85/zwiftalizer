var test = require('tape');

import { resolution } from '../src/parser';

test('should extract last seen screen resolution', assert => {
  const entries = '[20:23:52] Changed resolution to 2560 x 1440\n' +
    '[20:23:52] Changed resolution to 1920 x 1080(NO MSAA)\n' +
    '[20:23:52] Changed resolution to 1280 x 720\n';

  const expected = '720';
  const actual = resolution(entries);

  assert.equal(actual, expected);
  assert.end();
});
