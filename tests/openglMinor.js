var test = require('tape')

import {
  openglMinor,
} from '../src/parser'

test('should extract opengl minor version', (assert) => {

  const entry = '[7:14:50] Changed resolution to 1920 x 1080\n' +
    '[7:14:50] OpenGL 3.1.0 NVIDIA 359.06 initialized\n' +
    '[7:14:50] Graphics Vendor: NVIDIA Corporation\n';

  const expected = 'Nvidia 359.06'
  const actual = openglMinor(entry)

  assert.equal(actual, expected)
  assert.end()
})

test('should extract opengl minor NVIDIA-10.4.2 310.41.35f01', (assert) => {

  const entry = '[16:11:23] OpenGL 2.1 NVIDIA-10.4.2 310.41.35f01 initialized\n';

  const expected = 'Nvidia-10.4.2 310.41.35f01'
  const actual = openglMinor(entry)

  assert.equal(actual, expected)
  assert.end()
})

test('should extract opengl minor Compatibility Profile Context', (assert) => {

  const entry = '[16:11:23] OpenGL 3.1.11672 Compatibility Profile Context initialized\n';

  const expected = 'Compatibility Profile Context'
  const actual = openglMinor(entry)

  assert.equal(actual, expected)
  assert.end()
})

test('should extract opengl minor Build 10.18.15.4256', (assert) => {

  const entry = '[21:41:33] OpenGL 3.1.0 - Build 10.18.15.4256 initialized\n';

  const expected = 'Build 10.18.15.4256'
  const actual = openglMinor(entry)

  assert.equal(actual, expected)
  assert.end()
})
