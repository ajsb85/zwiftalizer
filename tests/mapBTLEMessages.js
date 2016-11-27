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
  mapBTLELines,
  mapBTLEMessages
} from '../src/parser'

// path is relative to the root of the project
const log = epochify(normalize(fs.readFileSync('./testdata/btle.txt', 'utf8')))

test('should map BTLE message data', (assert) => {

  const startTimestamp = moment(startDateTime(log), 'HH:mm:ss YYYY-MM-DD').unix()

  const trange = timerange(startTimestamp, duration(log))

  const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds)

  const actual = mapBTLEMessages(mapBTLELines(log), tAxis)

  assert.equal(actual.count(), 12, '12 seconds expected')

  assert.equal(actual.at(0).get('value'), 2, '2 messages per second')
  assert.equal(actual.at(1).get('value'), 4, '4 messages per second')
  assert.equal(actual.at(2).get('value'), 4, '4 messages per second')
  assert.equal(actual.at(3).get('value'), 4, '4 messages per second')
  assert.equal(actual.at(4).get('value'), 4, '4 messages per second')
  assert.equal(actual.at(5).get('value'), 5, '5 messages per second')
  assert.equal(actual.at(6).get('value'), 4, '4 messages per second')
  assert.equal(actual.at(7).get('value'), 3, '3 messages per second')
  assert.equal(actual.at(8).get('value'), 3, '3 messages per second')
  assert.equal(actual.at(9).get('value'), 2, '2 messages per second')
  assert.equal(actual.at(10).get('value'), 7, '7 messages per second')
  assert.equal(actual.at(11).get('value'), 2, '2 messages per second')
  assert.end()

})
