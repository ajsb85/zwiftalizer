var test = require('tape')

import {
  shadowres,
} from '../src/parser'

test('should extract last seen shadow resolution', (assert) => {

  const entries = '[7:14:50] > sres 1024x1024\n' +
    '[7:14:50] Changed shadow resolution to 1024 x 1024\n'

  const expected = '1024'
  const actual = shadowres(entries)

  assert.equal(actual, expected)
  assert.end()
})