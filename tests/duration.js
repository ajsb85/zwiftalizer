var test = require('tape');
var fs = require('fs');

import { normalize, epochify, duration } from '../src/parser';

// path is relative to the root of the project
epochify(
  normalize(fs.readFileSync('./testdata/testlog.txt', 'utf8')),
  (err, log) => {
    test('should extract log duration in seconds', assert => {
      if (err) {
        console.log(err);
        assert.fail();
      }

      // 2016-01-15 00:00:00  - 2016-01-12 20:23:47
      const expected = 13 + 60 * 36 + 60 * 60 * 3 + 60 * 60 * 24 * 2;
      const actual = duration(log);
      assert.equal(actual, expected);
      assert.end();
    });
  }
);
