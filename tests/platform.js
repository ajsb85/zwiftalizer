var test = require('tape')

import {
  platform
} from '../src/parser'

const testLogIsMac = 'foo\r' +
  // this is the mac line
  'bar\n' +
  'bif\r\n' +
  'baz\r\r\n'

const testLogIsPc = 'foo\r' +
  'bar\r\n' +
  'bif\r\n' +
  'baz\r\r\n'

test('should get platform mac', (assert) => {
  const expect = 'Mac'
  const actual = platform(testLogIsMac)
  assert.equal(actual, expect, 'platform is mac')
  assert.end()
})

test('should get platform PC', (assert) => {
  const expect = 'PC'
  const actual = platform(testLogIsPc)
  assert.equal(actual, expect, 'platform is PC')
  assert.end()
})