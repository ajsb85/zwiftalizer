var test = require('tape')
var fs = require('fs')

import {
  normalize,
  epochify,
  startDateTime,
  duration,
  reduceFps,
  mapFpsLines
} from '../src/parser'

// path is relative to the root of the project
epochify(normalize(fs.readFileSync('./testdata/sample.txt', 'utf8')), (err, log) => {
  test('should extract reduced fps data into buckets of 15 second averages', (assert) => {
    if (err) {
      console.log(err)
      assert.fail()
    }

    const fpsLines = mapFpsLines(log)

    const actual = reduceFps(fpsLines)

    assert.true(actual.count() > 0, 'reduced fps timeseries count should be greated than zero')

    assert.end()
  })

})
