var test = require('tape')

import {
  cpuClass,
} from '../src/parser'

test('should extract CPU class details i7-2600K', (assert) => {
  const entry = 'PC / Intel Core i7-2600K @ 3.40GHz / Nvidia GeForce GTX 980 Ti/PCIe/SSE2'
  const expected = '2nd generation i7 - Unlocked'
  const actual = cpuClass(entry)
  console.log(actual)
  assert.equals(actual, expected)
  assert.end()
})
