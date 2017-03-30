// There are two methods used by bicycle power sensors for information updates:

// Event-Synchronous Update e.g. the power information is updated each time the power sensor detects a new crank rotation.
// (Quarq, SRM, 4iiii, Power2Max, Pioneer, Stages, Garmin Vector, Powertap P1)

// Time-Synchronous Update e.g. the power information is updated at 1Hz.
// (Powertap Hubs)

// And then there is the Wahoo Kickr

var test = require('tape');
var moment = require('moment');

import {
  startDateTime,
  duration,
  timerange,
  timeAxis,
  normalize,
  epochify,
  mapAntLines,
  mapPowermeterData
} from '../src/parser';

test('should map powermeter lines from wheelpower powermeter', assert => {
  // note, Powertap sends 1 power entry per second, (averaged internally by the meter)

  // this is a perfectly normal pattern for a wheel/hub based powermeter
  // 1st second - 3 hits, 5 misses
  // 2nd second - 3 hits, 5 misses

  const entries = '[15:16:56] Log Time: 15:16:56 2016-07-23\n' +
    '[15:16:56] ANT  : Rx Fail on channel 1\n' +
    '[15:16:56] ANT  : [PowerMeter] Prev: WheelPower: EC: 060  WT: 006  Period: 21160  AccumTorque: 06615\n' +
    '[15:16:56] ANT  : [PowerMeter] WheelPower: EC: 061  WT: 009  Period: 21818  AccumTorque: 06882\n' +
    '[15:16:56] ANT  : [PowerMeter] Vang = 19.56 radians/sec   Tavg: 8.34 nm   Pavg: 163.17 watts timeElapsed=0.321\n' +
    '[15:16:56] ANT  : Rx Fail on channel 1\n' +
    '[15:16:56] ANT  : Rx Fail on channel 1\n' +
    '[15:16:56] ANT  : Rx Fail on channel 1\n' +
    '[15:16:57] ANT  : Rx Fail on channel 1\n' +
    '[15:16:57] ANT  : [PowerMeter] Prev: WheelPower: EC: 061  WT: 009  Period: 21818  AccumTorque: 06882\n' +
    '[15:16:57] ANT  : [PowerMeter] WheelPower: EC: 062  WT: 012  Period: 22477  AccumTorque: 07174\n' +
    '[15:16:57] ANT  : [PowerMeter] Vang = 19.53 radians/sec   Tavg: 9.13 nm   Pavg: 178.17 watts timeElapsed=0.322\n' +
    '[15:16:57] ANT  : Rx Fail on channel 1\n' +
    '[15:16:57] ANT  : Rx Fail on channel 1\n' +
    '[15:16:57] ANT  : Rx Fail on channel 1\n' +
    '[15:16:58] ANT  : Rx Fail on channel 1\n';

  epochify(normalize(entries), (err, log) => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    console.log(startDateTime(log));

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    console.log(startTimestamp);

    const trange = timerange(startTimestamp, duration(log));

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds);

    const actual = mapPowermeterData(mapAntLines(log), tAxis);

    assert.equal(actual.count(), 2, '2 seconds expected');

    //assert.equal(moment(actual.at(0).timestamp()).unix() * 1000, 1469286986000, 'timestamp 1469286986000')

    assert.equal(actual.at(0).get('value'), 163.17, 'avg power 163.17');
    assert.equal(actual.at(1).get('value'), 89.085, 'avg power 89.085');
    assert.end();
  });
});

test('should map powermeter lines from crank powermeter', assert => {
  // note, Quarq sends 2 power entries per second

  // this is a perfectly normal pattern for a crank based powermeter
  // 1st second - 4 hits, 4 misses
  // 2nd second - 2 hits, 4 misses

  const entries = '[20:01:05] Log Time: 20:01:05 2016-07-23\n' +
    '[20:01:05] ANT  : [PowerMeter] CrankPower: EC: 171  WT: 171  Period: 46644  AccumTorque: 54995\n' +
    '[20:01:05] ANT  : [PowerMeter] Vang = 8.10 radians/sec   Tavg: 22.25 nm   Pavg: 180.18 watts\n' +
    '[20:01:05] ANT  : Rx Fail on channel 1\n' +
    '[20:01:05] ANT  : Rx Fail on channel 1\n' +
    '[20:01:05] ANT  : Rx Fail on channel 1\n' +
    '[20:01:05] ANT  : [PowerMeter] CrankPower: EC: 172  WT: 172  Period: 48233  AccumTorque: 55687\n' +
    '[20:01:05] ANT  : [PowerMeter] Vang = 8.10 radians/sec   Tavg: 21.63 nm   Pavg: 175.12 watts\n' +
    '[20:01:05] ANT  : Rx Fail on channel 1\n' +
    '[20:01:06] ANT  : Rx Fail on channel 1\n' +
    '[20:01:06] ANT  : Rx Fail on channel 1\n' +
    '[20:01:06] ANT  : [PowerMeter] CrankPower: EC: 173  WT: 173  Period: 49823  AccumTorque: 56341\n' +
    '[20:01:06] ANT  : [PowerMeter] Vang = 8.09 radians/sec   Tavg: 20.44 nm   Pavg: 165.40 watts\n' +
    '[20:01:06] ANT  : Rx Fail on channel 1\n' +
    '[20:01:06] ANT  : Rx Fail on channel 1\n' +
    '[20:01:06] ANT  : Rx Fail on channel 1\n';

  epochify(normalize(entries), (err, log) => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    const trange = timerange(startTimestamp, duration(log));

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds);

    const actual = mapPowermeterData(mapAntLines(log), tAxis);

    assert.equal(actual.count(), 2, '2 seconds expected');

    // console.log(actual.toJSON())

    assert.equal(actual.at(0).get('value'), 177.65, 'avg power 177.65');
    assert.equal(actual.at(1).get('value'), 165.4, 'avg power 165.4');
    assert.end();
  });
});

test('should map powermeter lines from Kickr powermeter', assert => {
  // note, Kickr sends 2 power entries per second
  const entries = '[15:46:40] Log Time: 15:46:40 2016-07-23\n' +
    '[15:46:40] ANT  : Rx Fail on channel 1\n' +
    '[15:46:40] ANT  : Rx Fail on channel 1\n' +
    '[15:46:40] ANT  : [PowerMeter] Prev: WheelPower: EC: 082  WT: 082  Period: 59626  AccumTorque: 15252\n' +
    '[15:46:40] ANT  : [PowerMeter] WheelPower: EC: 085  WT: 085  Period: 60847  AccumTorque: 16005\n' +
    '[15:46:40] ANT  : [PowerMeter] Vang = 31.62 radians/sec   Tavg: 7.84 nm   Pavg: 247.99 watts timeElapsed=0.596\n' +
    '[15:46:41] ANT  : KICKR queuing grade change to 0.02\n' +
    '[15:46:41] ANT  : KICKR queuing Grade to 0.0\n' +
    '[15:46:41] ANT  : KICKR changing grade to 0.02\n' +
    '[15:46:41] ANT  : Setting Sim Grade 33536 \n' +
    '[15:46:41] ANT  : Rx Fail on channel 1\n' +
    '[15:46:41] ANT  : [PowerMeter] Prev: WheelPower: EC: 085  WT: 085  Period: 60847  AccumTorque: 16005\n' +
    '[15:46:41] ANT  : [PowerMeter] WheelPower: EC: 091  WT: 091  Period: 63278  AccumTorque: 17515\n' +
    '[15:46:41] ANT  : [PowerMeter] Vang = 31.76 radians/sec   Tavg: 7.86 nm   Pavg: 249.77 watts timeElapsed=1.187\n' +
    '[15:46:41] ANT  : Rx Fail on channel 1\n' +
    '[15:46:41] ANT  : [PowerMeter] Prev: WheelPower: EC: 091  WT: 091  Period: 63278  AccumTorque: 17515\n' +
    '[15:46:41] ANT  : [PowerMeter] WheelPower: EC: 092  WT: 092  Period: 63682  AccumTorque: 17762\n' +
    '[15:46:41] ANT  : [PowerMeter] Vang = 31.85 radians/sec   Tavg: 7.72 nm   Pavg: 245.85 watts timeElapsed=0.197\n' +
    '[15:46:41] ANT  : Rx Fail on channel 1\n' +
    '[15:46:42] ANT  : Rx Fail on channel 1\n' +
    '[15:46:42] ANT  : Rx Fail on channel 1\n' +
    '[15:46:42] ANT  : [PowerMeter] Prev: WheelPower: EC: 092  WT: 092  Period: 63682  AccumTorque: 17762\n' +
    '[15:46:42] ANT  : [PowerMeter] WheelPower: EC: 095  WT: 095  Period: 64894  AccumTorque: 18532\n' +
    '[15:46:42] ANT  : [PowerMeter] Vang = 31.85 radians/sec   Tavg: 8.02 nm   Pavg: 255.47 watts timeElapsed=0.592\n' +
    '[15:46:42] ANT  : Rx Fail on channel 1\n' +
    '[15:46:42] ANT  : [PowerMeter] Prev: WheelPower: EC: 095  WT: 095  Period: 64894  AccumTorque: 18532\n' +
    '[15:46:42] ANT  : [PowerMeter] WheelPower: EC: 097  WT: 097  Period: 00167  AccumTorque: 19036\n' +
    '[15:46:42] ANT  : [PowerMeter] Vang = 31.81 radians/sec   Tavg: 7.88 nm   Pavg: 250.51 watts timeElapsed=0.395\n' +
    '[15:46:42] ANT  : Rx Fail on channel 1\n' +
    '[15:46:43] ANT  : KICKR queuing grade change to 0.02\n' +
    '[15:46:43] ANT  : KICKR queuing Grade to 0.0\n' +
    '[15:46:43] ANT  : KICKR changing grade to 0.02\n' +
    '[15:46:43] ANT  : Setting Sim Grade 33376 \n' +
    '[15:46:43] ANT  : dID 721156 MFG 32 Model 1\n' +
    '[15:46:43] ANT  : Rx Fail on channel 1\n' +
    '[15:46:43] ANT  : [PowerMeter] Prev: WheelPower: EC: 097  WT: 097  Period: 00167  AccumTorque: 19036\n' +
    '[15:46:43] ANT  : [PowerMeter] WheelPower: EC: 103  WT: 103  Period: 02617  AccumTorque: 20540\n' +
    '[15:46:43] ANT  : [PowerMeter] Vang = 31.51 radians/sec   Tavg: 7.83 nm   Pavg: 246.85 watts timeElapsed=1.196\n' +
    '[15:46:44] ANT  : [PowerMeter] Prev: WheelPower: EC: 103  WT: 103  Period: 02617  AccumTorque: 20540\n' +
    '[15:46:44] ANT  : [PowerMeter] WheelPower: EC: 104  WT: 104  Period: 03031  AccumTorque: 20791\n' +
    '[15:46:44] ANT  : [PowerMeter] Vang = 31.08 radians/sec   Tavg: 7.84 nm   Pavg: 243.79 watts timeElapsed=0.202\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n' +
    '[15:46:44] ANT  : Rx Fail on channel 1\n';

  epochify(normalize(entries), (err, log) => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    const trange = timerange(startTimestamp, duration(log));

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds);

    const actual = mapPowermeterData(mapAntLines(log), tAxis);

    assert.equal(actual.count(), 2, '2 seconds expected');
    assert.equal(actual.at(0).get('value'), 247.9, 'avg power 247.9');
    assert.equal(
      Math.round(actual.at(1).get('value') * 100) / 100,
      247.88,
      'avg power 247.88'
    );

    assert.end();
  });
});

test('should map powermeter lines from Stages powermeter (left arm)', assert => {
  // this is a perfectly normal pattern for a crank arm based powermeter
  // 1st second - 2 hits, 4 misses
  // 2nd second - 1 hits, 5 misses
  const entries = '[13:31:22] Log Time: 13:31:22 2016-07-23\n' +
    '[13:31:22] ANT  : [PowerMeter] CrankPower: EC: 062  WT: 062  Period: 47977  AccumTorque: 03356\n' +
    '[13:31:22] ANT  : [PowerMeter] Vang = 8.88 radians/sec   Tavg: 24.25 nm   Pavg: 215.35 watts\n' +
    '[13:31:22] ANT  : Rx Fail on channel 2\n' +
    '[13:31:22] ANT  : Rx Fail on channel 2\n' +
    '[13:31:22] ANT  : Rx Fail on channel 2\n' +
    '[13:31:22] ANT  : [PowerMeter] CrankPower: EC: 063  WT: 063  Period: 49456  AccumTorque: 04132\n' +
    '[13:31:22] ANT  : [PowerMeter] Vang = 8.70 radians/sec   Tavg: 24.25 nm   Pavg: 210.98 watts\n' +
    '[13:31:22] ANT  : Rx Fail on channel 2\n' +
    '[13:31:23] ANT  : Rx Fail on channel 2\n' +
    '[13:31:23] ANT  : Rx Fail on channel 2\n' +
    '[13:31:23] ANT  : Rx Fail on channel 2\n' +
    '[13:31:23] ANT  : [PowerMeter] CrankPower: EC: 064  WT: 064  Period: 50962  AccumTorque: 04828\n' +
    '[13:31:23] ANT  : [PowerMeter] Vang = 8.54 radians/sec   Tavg: 21.75 nm   Pavg: 185.84 watts\n' +
    '[13:31:23] ANT  : Rx Fail on channel 2\n' +
    '[13:31:23] ANT  : Rx Fail on channel 2\n';

  epochify(normalize(entries), (err, log) => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    const trange = timerange(startTimestamp, duration(log));

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds);

    const actual = mapPowermeterData(mapAntLines(log), tAxis);

    assert.equal(actual.count(), 1, '1 second expected');
    assert.equal(actual.at(0).get('value'), 199.505, 'avg power 199.505');

    assert.end();
  });
});

test('should map powermeter lines from 4iiii Precision powermeter (left arm)', assert => {
  const entries = '[22:12:15] Log Time: 22:12:15 2016-07-23\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:15] ANT  : [PowerMeter] CrankPower: EC: 240  WT: 193  Period: 06851  AccumTorque: 37495\n' +
    '[22:12:15] ANT  : [PowerMeter] Vang = 8.01 radians/sec   Tavg: 20.69 nm   Pavg: 165.65 watts\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:15] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : [PowerMeter] CrankPower: EC: 241  WT: 194  Period: 08422  AccumTorque: 38138\n' +
    '[22:12:16] ANT  : [PowerMeter] Vang = 8.19 radians/sec   Tavg: 20.09 nm   Pavg: 164.58 watts\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:16] ANT  : Rx Fail on channel 2\n' +
    '[22:12:17] ANT  : Rx Fail on channel 2\n' +
    '[22:12:17] ANT  : Rx Fail on channel 2\n' +
    '[22:12:17] ANT  : Rx Fail on channel 2\n' +
    '[22:12:17] ANT  : [PowerMeter] CrankPower: EC: 243  WT: 196  Period: 11522  AccumTorque: 39468\n' +
    '[22:12:17] ANT  : [PowerMeter] Vang = 8.30 radians/sec   Tavg: 20.78 nm   Pavg: 172.52 watts\n' +
    '[22:12:17] ANT  : Rx Fail on channel 2\n' +
    '[22:12:17] ANT  : Rx Fail on channel 2\n' +
    // missed second, but not an ANT+ dropout!

    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:18] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : [PowerMeter] CrankPower: EC: 245  WT: 198  Period: 14470  AccumTorque: 40934\n' +
    '[22:12:19] ANT  : [PowerMeter] Vang = 8.73 radians/sec   Tavg: 22.91 nm   Pavg: 199.96 watts\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n' +
    '[22:12:19] ANT  : Rx Fail on channel 2\n';

  epochify(normalize(entries), (err, log) => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    const trange = timerange(startTimestamp, duration(log));

    const tAxis = timeAxis(trange.startMilliseconds, trange.endMilliseconds);

    const actual = mapPowermeterData(mapAntLines(log), tAxis);

    assert.equal(actual.count(), 2, '2 seconds expected');
    assert.equal(
      Math.round(actual.at(0).get('value') * 100) / 100,
      167.58,
      'avg power 167.58'
    );
    assert.equal(
      Math.round(actual.at(1).get('value') * 100) / 100,
      99.98,
      'avg power 99.98'
    );

    assert.end();
  });
});
