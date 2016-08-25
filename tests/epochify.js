var test = require('tape')
var fs = require('fs')

import {
  normalize,
  epochify,
  toArray
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/sample.txt', 'utf8'))

test('should convert all time entries to epoch times', (assert) => {

  const expected = toArray(log).length

  const converted = epochify(log)

  const actual = converted.length

  assert.true(actual === expected, 'number of lines after converting times is the same')

  const firstEntry = converted[0]

  const firstTime = parseInt(firstEntry.replace(/^\[([^\]]*)\].*$/i, '$1'))

  assert.ok(Number.isInteger(firstTime), 'first time entry is integer')

  assert.end()
})