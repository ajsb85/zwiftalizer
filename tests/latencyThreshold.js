const test = require('tape');
var _ = require('underscore');
var fs = require('fs');
var moment = require('moment');

import {
  normalize,
  epochify,
  mapNetworkLines,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser';

import { mapLatencyThresholdTests } from '../src/parser';

let t1 = '[20:32:50] Log Time: 20:32:50 2018-08-04\r\n';
t1 +=
  '[20:32:51] NETCLIENT:Failed one leg latency threshold test.  [min: 504, avg: 504, max: 504, n: 8]\r\n';
t1 +=
  '[20:33:51] NETCLIENT:Failed one leg latency threshold test.  [min: 511, avg: 721, max: 962, n: 24]\n\r';
t1 +=
  '[20:34:51] NETCLIENT:Failed one leg latency threshold test.  [min: 507, avg: 900, max: 2097, n: 41]';

epochify(normalize(t1), (err, log) => {
  test('should extract latency lines', assert => {
    if (err) {
      console.log(err);
      assert.fail();
    }

    console.log(log[0]);

    const startTimestamp = moment(
      startDateTime(log),
      'HH:mm:ss YYYY-MM-DD'
    ).unix();

    const trange = timerange(startTimestamp, duration(log));

    const tAxisTimeSeries = timeAxis(
      trange.startMilliseconds,
      trange.endMilliseconds
    );

    const actual = mapLatencyThresholdTests(
      mapNetworkLines(log),
      tAxisTimeSeries
    );

    assert.ok(actual);

    // 3 1 second slots
    const expectedLength = 3;

    assert.true(actual.count() > 0);

    assert.true(actual.count() === expectedLength);

    console.log(actual);

    assert.end();
  });
});
