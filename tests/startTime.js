var test = require('tape')
var fs = require('fs')

import {
  normalize,
  startTime
} from '../src/parser'

// path is relative to the root of the project
const log = normalize(fs.readFileSync('./testdata/testlog.txt', 'utf8'))

test('should extract first instance of log time', (assert) => {
  const expected = '20:23:47'
  const actual = startTime(log)
  assert.equal(actual, expected, 'actual log time equal expected')
  assert.end()
})