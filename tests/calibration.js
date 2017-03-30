// reference: http://www.slowtwitch.com/Tech/Power_Meter_101_3643.html

var test = require('tape')

import {
  mapCalibrationData
} from '../src/parser'

import {
  bigendian,
  littleendian
} from '../src/parser/mapCalibrationData'

test('should get saris (powertap) calibration value 475', (assert) => {
  const line = '[14:22:09] Calibration data [1] [172] [255] [255] [255] [255] [219] [1]'
  const expect = 475
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.equal(actual.status, true, 'calibration success')
  assert.equal(actual.autoZero, undefined, 'autoZero unsupported')
  assert.end()
})

test('should get saris (powertap) calibration value 1', (assert) => {
  const line = '[14:22:09] Calibration data [1] [172] [255] [255] [255] [255] [1] [0]'
  const expect = 1
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.equal(actual.status, true, 'calibration success')
  assert.equal(actual.autoZero, undefined, 'autoZero unsupported')
  assert.end()
})

test('should get last saris (powertap) calibration of many', (assert) => {
  const line = '[14:22:09] Calibration data [1] [172] [255] [255] [255] [255] [2] [5]\n' +
    '[14:22:09] Calibration data [1] [172] [255] [255] [255] [255] [2] [3]\n' +
    '[14:22:09] Calibration data [1] [172] [255] [255] [255] [255] [2] [1]'
  const expect = 258
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.equal(actual.status, true, 'calibration success')
  assert.equal(actual.autoZero, undefined, 'autoZero unsupported')
  assert.end()
})

test('should get Quarq calibration value 12543', (assert) => {
  const line = '[14:35:27] Calibration data [1] [18] [3] [57] [48] [57] [48] [255]'
  const expect = 12543
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.equal(actual.autoZero, true, 'autoZero supported')
  assert.end()
})

test('should get Quarq calibration value 65279', (assert) => {
  const line = '[19:52:17] Calibration data [1] [18] [3] [255] [255] [11] [254] [255]\n' +
    '[19:52:17] NEW Calibration offset = 65279 stdDeviation = 0.00'
  const expect = 65279
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.end()
})

test('should get Quarq calibration value 64511', (assert) => {
  const line = '[10:58:59] Calibration data [1] [18] [3] [255] [255] [9] [251] [255]\n' +
    '[10:58:59] NEW Calibration offset = 64511 stdDeviation = 0.00'
  const expect = 64511
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.end()
})

test('should get Quarq calibration value 65023', (assert) => {
  const line = '[21:44:35] Calibration data [1] [18] [3] [255] [255] [209] [253] [255]\n'
  '[21:44:35] NEW Calibration offset = 65023 stdDeviation = 0.00'
  const expect = 65023
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect, 'calibration value should be ' + expect)
  assert.end()
})

test('should get Quarq calibration value 38656', (assert) => {
  const line = '[2:09:19] Calibration data [1] [172] [1] [81] [0] [0] [151] [0]\n' +
    '[2:09:19] NEW Calibration offset = 38656 stdDeviation = 0.00'

  const expect1 = 151
  const expect2 = 38656

  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect1, 'calibration value should be ' + expect1)
  assert.equal(actual.values[1], expect2, 'calibration value should be ' + expect2)
  assert.end()
})

test('should get 4iiii Precision calibration values 24617, 10592', (assert) => {
  const line = '[6:34:04] Calibration data [1] [172] [255] [255] [255] [255] [96] [41]\n' +
    '[6:34:04] NEW Calibration offset = 24617 stdDeviation = 0.00'
  const expect1 = 10592
  const expect2 = 24617
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect1, 'calibration value should be ' + expect1)
  assert.equal(actual.values[1], expect2, 'calibration value should be ' + expect2)
  assert.end()
})

// expect a Zero Reset (Calibration) value of 890 +/- 50 counts for Stages.
test('should get stages calibration values 2816, 11', (assert) => {
  const line = '[12:41:22] Calibration data [1] [172] [255] [255] [255] [255] [11] [0]\n'
  const expect1 = 11
  const expect2 = 2816
  const actual = mapCalibrationData(line)
  assert.equal(actual.values[0], expect1, 'calibration value should be ' + expect1)
  assert.equal(actual.values[1], expect2, 'calibration value should be ' + expect2)
  assert.end()
})

// @todo, power2max
// http://www.dcrainmaker.com/2013/01/power2max-power-meter-in-depth-review.html
// expect a Zero Reset (Calibration) value of -860
