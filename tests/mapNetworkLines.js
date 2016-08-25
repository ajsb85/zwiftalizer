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
  mapNetworkLines
} from '../src/parser'

// path is relative to the root of the project
const log = epochify(normalize(fs.readFileSync('./testdata/network.txt', 'utf8')))

test('should map networking lines', (assert) => {

  const actual = mapNetworkLines(log)

  const expectedLength = 10

  assert.true(actual.length > 0)

  assert.true(actual.length === expectedLength)

  assert.end()

})
