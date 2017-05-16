var _ = require('underscore');

import { TimeSeries, max } from 'pondjs';

import toArray from './toArray';

import {ANT_AVERAGES_WINDOW_IN_SEC} from './constants';

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapAntSearches(lines, timeAxisTimeSeries) {

  const result = {
    name: 'searches',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  const searchesRegex = /^\[[^\]]*\]\s+?ant\s+?:\s+?(goto\ssearch.|ant\s+?usb\s+?receiver\s+?found)$/i;

  const searches = [];

  _.each(antLines, line => {
    searchesRegex.test(line) && searches.push(line);
  });

  _.each(searches, line => {
    const matches = line.match(/^\[([^\]]*)\].*$/i);

    if (!matches) {
      return;
    }

    const timestamp = parseInt(matches[1]);

    result.points.push([timestamp, 1]);
  });

  const ts = new TimeSeries(result);

  const reducedSeries = TimeSeries.timeSeriesListSum({
    name: 'searches',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, ts]
  });

  // rollup max to exaggerate the search bars
  const rollup = reducedSeries.fixedWindowRollup({
    windowSize: `${ANT_AVERAGES_WINDOW_IN_SEC}s`,
    aggregation: {
      value: {
        value: max()
      }
    }
  });

  return rollup;
}
