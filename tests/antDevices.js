var _ = require('underscore');
var test = require('tape');

import { antDevices } from '../src/parser';

const lines = '[7:14:50] ANT  : Pairing deviceID 55811 to channel 1, mfg network 0, ant network 0\n' +
  '[7:14:50] ANT  : Pairing deviceID 17085 to channel 2, mfg network 0, ant network 0\n' +
  '[7:14:50] ANT  : Pairing deviceID 50646 to channel 3, mfg network 0, ant network 0';

test('should get devices', assert => {
  const devices = antDevices(lines);

  assert.equal(devices.length, 3, '3 ant devices found');

  const deviceOnChannel1 = _.findWhere(devices, {
    channel: '1'
  });
  assert.equal(deviceOnChannel1.deviceId, 55811, '55811 on channel 1');

  const deviceOnChannel2 = _.findWhere(devices, {
    channel: '2'
  });
  assert.equal(deviceOnChannel2.deviceId, 17085, '17085 on channel 2');

  const deviceOnChannel3 = _.findWhere(devices, {
    channel: '3'
  });
  assert.equal(deviceOnChannel3.deviceId, 50646, '50646 on channel 3');

  assert.end();
});
