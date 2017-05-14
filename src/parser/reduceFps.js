var _ = require('underscore');
var moment = require('moment');

import { Event, Collection, EventOut, Pipeline, TimeSeries, avg } from 'pondjs';

import toArray from './toArray';

// lines is assumed to be fps lines only, as an array, already run through the epoch time converter
// Returns a structure ready to turn into a  PondJs TimeSeries using new TimeSeries(reduceFps)
export default function reduceFps(lines, sampleWindow = '15s') {
  const lowFpsAtStartThreshold = 5;

  const result = {
    name: 'fps',
    columns: ['time', 'value'],
    points: []
  };

  const fpsLines = Array.isArray(lines) ? lines : toArray(lines);

  if (!fpsLines || !fpsLines.length) {
    return new TimeSeries(result);
  }

  _.each(fpsLines, line => {
    const matches = line.match(/^\[([^\]]*)\]\s+?fps\s+?(\d+),.*$/i);

    if (!matches) {
      console.log('Failed to extract FPS time and value entry');
      return;
    }

    try {
      const timestamp = parseInt(matches[1]);

      const value = parseInt(matches[2]);

      // often, there is a junk 5 fps line before the GPU kicks in
      // skip it, but only if fpsTimeseries has no length yet (at the start)

      if (result.points.length === 0 && value <= lowFpsAtStartThreshold) {
        return;
      }

      result.points.push([timestamp, value]);
    } catch (e) {
      console.log('Failed to parse FPS entry', e);
    }
  });

  if (result.points.length === 0) {
    return new TimeSeries(result);
  }

  const timeseries = new TimeSeries(result);

  const rollup = timeseries.fixedWindowRollup({
    windowSize: sampleWindow,
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  return rollup;
}
