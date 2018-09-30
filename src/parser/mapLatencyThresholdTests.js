import { TimeSeries, max } from 'pondjs';

import toArray from './toArray';

const _ = require('underscore');

// lines is assumed to be Networking lines only, as an array, with times already in unix format using epochify
export default function mapLatencyThresholdTests(lines, timerange) {
  const columnDefs = ['time', 'min', 'avg', 'max', 'n'];

  // milliseconds
  const step = 1000;

  const defaultPoints = [];

  // creates a default time axis
  // of all zeros for each data point
  for (
    let i = timerange.startMilliseconds;
    i < timerange.endMilliseconds;
    i += step
  ) {
    defaultPoints.push([i, 0, 0, 0, 0]);
  }

  // make a complete x-axis timeseries of all zeros
  const timeAxisTimeSeries = new TimeSeries({
    name: 'xaxis',
    columns: columnDefs,
    points: defaultPoints
  });

  const result = {
    name: 'latency',
    columns: columnDefs,
    points: []
  };

  const latencyTestLines = Array.isArray(lines) ? lines : toArray(lines);

  const latencyTestRegex = /^\[([^\]]*)\]\s+netclient:failed\s+?one\s+?leg\s+?latency\s+?threshold\s+?test\.\s+\[([^\]]*)\]$/i;

  const latencyEntries = [];

  _.each(latencyTestLines, line => {
    if (latencyTestRegex.test(line)) {
      latencyEntries.push(line);
    }
  });

  _.each(latencyEntries, line => {
    // @todo, pluck out the min, max, avg, n
    const matches = line.match(latencyTestRegex);

    if (!matches) {
      return;
    }

    const timestamp = parseInt(matches[1], 10);

    console.log(`${matches[1]}`);

    // the 2nd capture group is almost valid json - 'min: 504, avg: 504, max: 504, n: 8'
    const tokens = `${matches[2]}`.split(',');

    const valueObject = {};

    tokens.forEach(t => {
      try {
        const pair = t.split(':');
        const key = pair[0].trim();

        if (columnDefs.includes(key)) {
          const value = parseInt(pair[1].trim(), 10);
          valueObject[key] = value;
        }
      } catch (e) {
        console.log(`failed to parse latency threshold test entry. ${t}: ${e}`);
      }
    });

    result.points.push([
      timestamp,
      valueObject.min,
      valueObject.avg,
      valueObject.max,
      valueObject.n
    ]);
  });

  const ts = new TimeSeries(result);

  // This merges the values with timeAxisTimeSeries
  // where timeAxisTimeSeries is pre-populated with all zeros.
  // The max function is used to get the max of the default
  // value (0) and the recorded value.
  const reducedSeries = TimeSeries.timeSeriesListReduce({
    name: 'latencyThresholdTests',
    fieldSpec: ['time', 'min', 'avg', 'max', 'n'],
    seriesList: [timeAxisTimeSeries, ts],
    reducer: max()
  });

  return reducedSeries;
}
