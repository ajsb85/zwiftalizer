var test = require('tape')

import {
  cpuVendor,
  cpuDetails
} from '../src/parser'

test('should extract CPU vendor', (assert) => {
  const entry = '[23:27:56] CPU: Intel(R) Core(TM)2 Duo CPU     E8400  @ 3.00GHz'
  const expected = 'Intel'
  const actual = cpuVendor(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Core2 Duo CPU details', (assert) => {
  const entry = '[23:27:56] CPU: Intel(R) Core(TM)2 Duo CPU     E8400  @ 3.00GHz'
  const expected = 'Core2 Duo E8400 @ 3.00GHz'
  const actual = cpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Core i3 CPU details', (assert) => {
  const entry = '[21:06:31] CPU: Intel(R) Core(TM) i3-4170 CPU @ 3.70GHz'
  const expected = 'Core i3-4170 @ 3.70GHz'
  const actual = cpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Core i5 CPU details', (assert) => {
  const entry = '[1:50:36] CPU: Intel(R) Core(TM) i5-4690K CPU @ 3.50GHz'
  const expected = 'Core i5-4690K @ 3.50GHz'
  const actual = cpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})