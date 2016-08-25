var test = require('tape')

import {
  toArray
} from '../src/parser'

test('should turn string into array of lines by splitting on newline', (assert) => {
  const entries = 'A B C\nD E F\nH I J\nK L M\n'
  const expected = ['A B C', 'D E F', 'H I J', 'K L M']
  const actual = toArray(entries)
  assert.deepEqual(actual, expected)
  assert.end()
})