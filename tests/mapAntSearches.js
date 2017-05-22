var _ = require('underscore');
var test = require('tape');
var fs = require('fs');
var moment = require('moment');

import {
  normalize,
  epochify,
  mapAntLines,
  mapAntSearches,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser';

// path is relative to the root of the project
epochify(
  normalize(fs.readFileSync('./testdata/sample.txt', 'utf8')),
  (err, log) => {
    test('should extract ANT+ Searching lines', assert => {
      if (err) {
        console.log(err);
        assert.fail();
      }

      const startTimestamp = moment(
        startDateTime(log),
        'HH:mm:ss YYYY-MM-DD'
      ).unix();

      const trange = timerange(startTimestamp, duration(log));

      const tAxisTimeSeries = timeAxis(
        trange.startMilliseconds,
        trange.endMilliseconds
      );

      const actual = mapAntSearches(mapAntLines(log), tAxisTimeSeries);

      // 1 second rollup
      //const expectedLength = 1227

      // 2 second rollup
      const expectedLength = 614

      // 10 second rollup
      // const expectedLength = 123;

      assert.ok(actual);

      assert.true(actual.count() > 0);

      console.log(`${actual.count()} total ant+ searches time slots`);

      assert.true(actual.count() === expectedLength);

      // expect an entry in the first time slot rollup
      const first = actual.atFirst();

      // console.log(first);

      assert.true(first.get('value'), 1);

      const expectedTotalSearches = 5;

      let totalSearches = 0;

      // use the timeseries event iterator
      // to get the sum of all the +1 values.
      // (we have to return the event e because this iterator is designed to maniplate and return e) 
      actual.map(e => {
        totalSearches += parseInt(e.get('value'));
        return e;
      })

      console.log(`${totalSearches} total searches`);

      assert.equal(totalSearches, expectedTotalSearches, 'expected total searches');

      assert.end();
    });
  }
);
