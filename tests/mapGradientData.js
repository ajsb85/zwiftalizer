var test = require('tape')
var fs = require('fs')
var moment = require('moment')

import {
  startDateTime,
  duration,
  timerange,
  timeAxis,
  normalize,
  epochify,
  mapAntLines,
  mapGradientData
} from '../src/parser'

// path is relative to the root of the project

epochify(normalize(fs.readFileSync('./testdata/gradients.txt', 'utf8')), (err, log) => {
  test('should map gradient change lines from FE-C data', (assert) => {
    if (err) {
      console.log(err)
      assert.fail()
    }
    const startTimestamp = moment(startDateTime(log), 'HH:mm:ss YYYY-MM-DD').unix()

    const trange = timerange(startTimestamp, duration(log))

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds)

    const actual = mapGradientData(mapAntLines(log), tAxis)

    assert.equal(actual.count(), 3, '3 seconds expected')

    assert.equal(actual.at(0).get('value').toFixed(3), '-0.100', 'gradient -0.100')
    assert.equal(actual.at(1).get('value').toFixed(3), '0.005', 'gradient 0.005')
    assert.equal(actual.at(2).get('value').toFixed(3), '0.090', 'gradient 0.090')
    assert.end()

  })

})
