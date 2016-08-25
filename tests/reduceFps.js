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
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'))

test('should extract reduced fps data into buckets of 15 second averages', (assert) => {

  const epochified = epochify(log)

  const fpsLines = mapFpsLines(epochified)

  const actual = reduceFps(fpsLines)

  //console.log(actual.toString())

  assert.true(actual.count() > 0, 'reduced fps timeseries count should be greated than zero')

  assert.end()
})