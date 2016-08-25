var test = require('tape')
var _ = require('underscore')
var fs = require('fs')

const devices = [{
  deviceId: '1',
  level: 3
}, {
  deviceId: '1',
  level: 2
}, {
  deviceId: '1',
  level: 1
}, {
  deviceId: '2',
  level: 2
}, {
  deviceId: '2',
  level: 2
}, {
  deviceId: '2',
  level: 2
}, {
  deviceId: '3',
  level: 3
}, {
  deviceId: '3',
  level: 3
}, {
  deviceId: '3',
  level: 1
}]

test('should get min battery level for each device', (assert) => {

  console.log(_.groupBy(devices, 'deviceId'))

  const reduced = _.chain(devices)
    .groupBy('deviceId')
    .map((obj, key) => {
      var minLevel = _.chain(obj).pluck('level').min().value()
      return {
        deviceId: key,
        level: minLevel
      }
    })
    .value()

  const expect = [{
    deviceId: '1',
    level: 1
  }, {
    deviceId: '2',
    level: 2
  }, {
    deviceId: '3',
    level: 1
  }]

  console.log(reduced)

  assert.deepEqual(reduced, expect)

  assert.end()

})
