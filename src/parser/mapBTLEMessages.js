var _ = require('underscore');

import { TimeSeries, sum } from 'pondjs';

import toArray from './toArray';

// lines is assumed to be BTLE lines only, as an array, with times already in unix format using epochify
export default function mapBTLEMessages(lines, timeAxisTimeSeries) {
  const result = {
    name: 'messages',
    columns: ['time', 'value'],
    points: []
  };

  const btleLines = Array.isArray(lines) ? lines : toArray(lines);

  _.each(btleLines, line => {
    const matches = line.match(/^\[([^\]]*)\].*$/i);

    if (!matches) {
      return;
    }

    const timestamp = parseInt(matches[1]);

    result.points.push([timestamp, 1]);
  });

  const ts = new TimeSeries(result);

  if (!ts.count()) {
    return null;
  }

  const reducedSeries = TimeSeries.timeSeriesListSum({
    name: 'messages',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, ts]
  });

  // plot sum of all btle signals per 5 seconds
  const rollup = reducedSeries.fixedWindowRollup({
    windowSize: '5s',
    aggregation: {
      value: {
        value: sum()
      }
    }
  });

  return rollup;
}
