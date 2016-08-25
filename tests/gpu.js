var test = require('tape')

import {
  gpuVendor,
  gpuDetails
} from '../src/parser'

test('should extract Intel GPU vendor', (assert) => {
  const entry = '[16:38:36] Graphics Vendor: Intel'
  const expected = 'Intel'
  const actual = gpuVendor(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Nvidia GPU vendor', (assert) => {
  const entry = '[1:50:36] Graphics Vendor: NVIDIA Corporation'
  const expected = 'Nvidia'
  const actual = gpuVendor(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract ATi ATI vendor', (assert) => {
  const entry = '[21:06:31] Graphics Vendor: ATI Technologies Inc.'
  const expected = 'ATi'
  const actual = gpuVendor(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Intel HD GPU details', (assert) => {
  const entry = '[16:38:36] Graphics Renderer: Intel(R) HD Graphics'
  const expected = 'Intel HD Graphics'
  const actual = gpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Intel Iris Pro GPU details', (assert) => {
  const entry = '[22:23:20] Graphics Renderer: Intel Iris Pro OpenGL Engine'
  const expected = 'Intel Iris Pro OpenGL Engine'
  const actual = gpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract Nvidia GPU details', (assert) => {
  const entry = '[1:50:36] Graphics Renderer: GeForce GTX 980 Ti/PCIe/SSE2'
  const expected = 'GeForce GTX 980 Ti/PCIe/SSE2'
  const actual = gpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})

test('should extract AMD GPU details', (assert) => {
  const entry = '[21:06:31] Graphics Renderer: AMD Radeon HD 7800 Series'
  const expected = 'AMD Radeon HD 7800 Series'
  const actual = gpuDetails(entry)
  assert.equal(actual, expected)
  assert.end()
})