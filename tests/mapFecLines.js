var test = require('tape')
var fs = require('fs')

import {
  normalize,
  mapFecLines,
  toArray
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/testlog-neo.txt', 'utf8'))

test('should extract FE-C, and FET lines', (assert) => {

  const actual = mapFecLines(log)

  // 1 second rollups
  const expectedLength = 3566

  assert.true(actual.length > 0)

  assert.true(actual.length === expectedLength, 'length does not match. actual ' + actual.length)

  assert.end()
})
