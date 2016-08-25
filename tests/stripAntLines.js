var test = require('tape')
var fs = require('fs')

import {
  normalize,
  stripAntLines,
  toArray
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'))

test('should remove raw ANT lines from log', (assert) => {

  const lineCountBefore = toArray(log).length

  const logWithoutAntLines = normalize(stripAntLines(log))

  const lineCountAfter = toArray(logWithoutAntLines).length

  const expectedFewerLines = 11303

  assert.true(lineCountBefore - lineCountAfter === expectedFewerLines)

  assert.end()
})