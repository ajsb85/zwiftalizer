var _ = require('underscore')
var test = require('tape')
var fs = require('fs')
var moment = require('moment')

import {
  normalize,
  epochify,
  mapAntLines,
  mapAntSearches,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser'

// path is relative to the root of the project
const log = epochify(normalize(fs.readFileSync('./testdata/sample.txt', 'utf8')))

test('should extract ANT+ Searching lines', (assert) => {

  const startTimestamp = moment(startDateTime(log), 'HH:mm:ss YYYY-MM-DD').unix()

  const trange = timerange(startTimestamp, duration(log))

  const tAxisTimeSeries = timeAxis(trange.startMilliseconds, trange.endMilliseconds)

  const actual = mapAntSearches(mapAntLines(log), tAxisTimeSeries)

  // 1 second rollup
  //const expectedLength = 1227

  // 30 second rollup
  const expectedLength = 42

  assert.ok(actual)

  assert.true(actual.count() > 0)

  assert.true(actual.count() === expectedLength)

  const first = actual.atFirst()

  assert.true(first.get('value'), 1)

  assert.end()
})
