var _ = require('underscore')
var test = require('tape')
var fs = require('fs')
var moment = require('moment')

import {
  normalize,
  epochify,
  mapNetworkLines,
  mapNetworkErrors,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser'

// path is relative to the root of the project

epochify(normalize(fs.readFileSync('./testdata/network.txt', 'utf8')), (err, log) => {
  test('should extract network error lines', (assert) => {
    if (err) {
      console.log(err)
      assert.fail()
    }
    const startTimestamp = moment(startDateTime(log), 'HH:mm:ss YYYY-MM-DD').unix()

    const trange = timerange(startTimestamp, duration(log))

    const tAxisTimeSeries = timeAxis(trange.startMilliseconds, trange.endMilliseconds)

    const actual = mapNetworkErrors(mapNetworkLines(log), tAxisTimeSeries)

    // 117 10 second slots
    const expectedLength = 117

    assert.ok(actual)

    assert.true(actual.generalErrors.count() > 0)

    assert.true(actual.generalErrors.count() === expectedLength)

    assert.true(actual.generalErrors.max() === 1)

    assert.end()
  })

})
