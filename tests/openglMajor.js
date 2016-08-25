var test = require('tape')

import {
  openglMajor,
} from '../src/parser'

test('should extract opengl major version', (assert) => {

  const entry = '[7:14:50] Changed resolution to 1920 x 1080\n' +
    '[7:14:50] OpenGL 3.1.0 NVIDIA 359.06 initialized\n' +
    '[7:14:50] Graphics Vendor: NVIDIA Corporation\n';

  const expected = '3.1.0'
  const actual = openglMajor(entry)

  assert.equal(actual, expected)
  assert.end()
})