import { TimeSeries, max, sum } from 'pondjs';

import toArray from './toArray';

const _ = require('underscore');

// lines is assumed to be Networking lines only, as an array, with times already in unix format using epochify
export default function mapNetworkPhoneConnectionAttempts(
  lines,
  timeAxisTimeSeries
) {
  const result = {
    name: 'phoneConnectionAttempts',
    columns: ['time', 'value'],
    points: []
  };

  const networkLines = Array.isArray(lines) ? lines : toArray(lines);

  const connectionAttemptsRegex = /^\[[^\]]*\]\s+netclient:auxiliary\scontroller:\sattempting\sto\sconnect\sto\sphone.*$/i;

  const phoneConnectionAttempts = [];

  _.each(networkLines, line => {
    if (connectionAttemptsRegex.test(line)) {
      phoneConnectionAttempts.push(line);
    }
  });

  _.each(phoneConnectionAttempts, line => {
    const matches = line.match(/^\[([^\]]*)\].*$/i);

    if (!matches) {
      return;
    }

    const timestamp = parseInt(matches[1], 10);

    result.points.push([timestamp, 1]);
  });

  const ts = new TimeSeries(result);

  const reducedSeries = TimeSeries.timeSeriesListReduce({
    name: 'phoneConnectionAttempts',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, ts],
    reducer: sum()
  });

  // rollup max to exaggerate the reconnects bars
  const rollup = reducedSeries.fixedWindowRollup({
    windowSize: '60s',
    aggregation: {
      value: {
        value: max()
      }
    }
  });

  return rollup;
}
