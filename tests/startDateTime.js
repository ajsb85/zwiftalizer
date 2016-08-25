var test = require('tape')
var fs = require('fs')

import {
  normalize,
  startDateTime
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/testlog.txt', 'utf8'))

test('should extract first instance of log date and time', (assert) => {
  const expected = '20:23:47 2016-01-12'
  const actual = startDateTime(log)
  assert.equal(actual, expected, 'actual log date and time equal expected')
  assert.end()
})