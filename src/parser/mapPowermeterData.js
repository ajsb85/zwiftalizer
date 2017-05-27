import { TimeSeries, avg } from 'pondjs';

import toArray from './toArray';

import { nonZeroAvgReducer } from './functions';

const _ = require('underscore');

export const powerEntryRegex = /^\[[^\]]*\]\s+?ant\s+?:\s+?\[powermeter\]\s+?.*pavg:.*$/i;

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapPowermeterData(lines, timeAxisTimeSeries) {
  const result = {
    name: 'power',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  // map out all the power lines containing 'Pavg' first
  const powerLines = [];

  _.each(antLines, line => {
    powerEntryRegex.test(line) && powerLines.push(line);
  });

  if (!powerLines.length) {
    return new TimeSeries(result);
  }

  // now capture the time and the avg power reading
  _.each(powerLines, line => {
    const matches = line.match(
      /^\[([^\]]*)\]\s+?ant\s+?:\s+?\[powermeter\]\s+?.*pavg:\s+?([\d\.]*)\s+?watts.*$/i
    );

    if (!matches) {
      console.log('Failed to extract power entry');
      return;
    }

    try {
      const timestamp = parseInt(matches[1], 10);

      const value = Math.round(matches[2] * 100) / 100;

      result.points.push([timestamp, value]);
    } catch (e) {
      console.log('Failed to parse ant avg power entry', e);
    }
  });

  if (result.points.length === 0) {
    return new TimeSeries(result);
  }

  const powerTimeSeries = new TimeSeries(result);

  const reducedSeries = TimeSeries.timeseriesListReduce({
    name: 'power',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, powerTimeSeries],
    reducer: nonZeroAvgReducer
  });

  // 3 second average power
  const rollup = reducedSeries.fixedWindowRollup({
    windowSize: '3s',
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  return rollup;
}
