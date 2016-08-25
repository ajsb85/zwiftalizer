var test = require('tape')

import {
  opengl,
} from '../src/parser'

test('should extract opengl version', (assert) => {

  const entry = '[7:14:50] Changed resolution to 1920 x 1080\n' +
    '[7:14:50] OpenGL 3.1.0 NVIDIA 359.06 initialized\n' +
    '[7:14:50] Graphics Vendor: NVIDIA Corporation\n';

  const expected = '3.1.0 Nvidia 359.06'
  const actual = opengl(entry)

  assert.equal(actual, expected)
  assert.end()
})