var test = require('tape')
var fs = require('fs')

import {
  normalize,
  epochify,
  duration,
  toHoursMinutesSeconds,
  humanizeDuration
} from '../src/parser'

// path is relative to the root of the project
epochify(normalize(fs.readFileSync('./testdata/testlog.txt', 'utf8')), (err, log) => {
  test('should extract log duration in humanly readable format', (assert) => {
    if (err) {
      console.log(err)
      assert.fail()
    }

    const expected = '3 hrs 36 mins'
    const actual = humanizeDuration(toHoursMinutesSeconds(duration(log)))
    assert.equal(actual, expected)
    assert.end()
  })

})
