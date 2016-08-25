var _ = require('underscore')
var test = require('tape')
var fs = require('fs')
var moment = require('moment')

import {
  normalize,
  epochify,
  mapNetworkLines,
  mapNetworkReconnects,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser'

// path is relative to the root of the project
const log = epochify(normalize(fs.readFileSync('./testdata/network.txt', 'utf8')))

test('should extract network reconnect lines', (assert) => {

  const startTimestamp = moment(startDateTime(log), 'HH:mm:ss YYYY-MM-DD').unix()

  const trange = timerange(startTimestamp, duration(log))

  const tAxisTimeSeries = timeAxis(trange.startMilliseconds, trange.endMilliseconds)

  const actual = mapNetworkReconnects(mapNetworkLines(log), tAxisTimeSeries)

  // 117 10 second slots
  const expectedLength = 117

  assert.ok(actual)

  assert.true(actual.count() > 0)

  assert.true(actual.count() === expectedLength)

  assert.true(actual.max() === 1)

  assert.end()
})
