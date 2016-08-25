var test = require('tape')
var fs = require('fs')

import {
  normalize,
  mapFpsLines,
  toArray
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'))

test('should extract raw fps lines', (assert) => {

  const actual = mapFpsLines(log)

  const expectedLength = 491

  assert.true(actual.length > 0)

  assert.true(actual.length === expectedLength)

  assert.end()
})
