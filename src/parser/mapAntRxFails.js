import { TimeSeries, avg } from 'pondjs';

import toArray from './toArray';

import indexToUnixTime from './indexToUnixTime';

import secondsToTime from './secondsToTime';

import {
  WAHOO_MANUFACTURER_ID,
  WAHOO_KICKR_MODEL_ID,
  WAHOO_KICKR_SNAP_MODEL_ID,
  TACX_MANUFACTURER_ID,
  TACX_NEO_MODEL_IDS,
  ANT_AVERAGES_WINDOW_IN_SEC,
  FOUR_HZ,
  EIGHT_HZ
} from './constants';

const _ = require('underscore');

const sprintf = require('sprintf-js').sprintf;

const antRxFailFmt = '^\\[[^\\]]*\\]\\s+?ant\\s+?:\\s+?rx\\s+?fail\\s+?on\\s+?channel\\s+?%s$';

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapAntRxFails(
  lines,
  device,
  timeAxisTimeSeries,
  searchesTimestamps
) {
  const dropouts = [];

  let totalRxFails = 0;

  const result = {
    name: 'signal',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  const rxFailRegex = new RegExp(sprintf(antRxFailFmt, device.channel), 'i');

  const fails = [];

  _.each(antLines, line => {
    if (rxFailRegex.test(line)) {
      fails.push(line);
    }
  });

  // fails is only for the current channel, so now count them in each distinct timeslot
  _.each(fails, line => {
    const matches = line.match(/^\[([^\]]*)\].*$/i);

    if (!matches) {
      return;
    }

    try {
      const timestamp = parseInt(matches[1], 10);
      const value = 1;
      totalRxFails += 1;
      result.points.push([timestamp, value]);
    } catch (e) {
      console.log('Failed to parse ant rx fail time entry', e);
    }
  });

  const ts = new TimeSeries(result);

  const mergedSeries = TimeSeries.timeSeriesListSum({
    name: 'signal',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, ts]
  });

  // const minValue = mergedSeries.min();

  const maxValue = mergedSeries.max();

  const rollup = mergedSeries.fixedWindowRollup({
    windowSize: `${ANT_AVERAGES_WINDOW_IN_SEC}s`,
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  let sampleRate = FOUR_HZ;

  // Try to use device manufacturerId and modelId to make a better guess
  // at whether the device is 4HZ or 8HZ data rate.
  // If the max number of RxFails is higher than 5
  // or if the device is either known to be a Power meter, Kickr or Neo then use 8HZ
  if (
    maxValue > FOUR_HZ + 1 ||
    (device.manufacturerId &&
      device.modelId &&
      ((`${device.manufacturerId}` === WAHOO_MANUFACTURER_ID &&
        (`${device.modelId}` === WAHOO_KICKR_MODEL_ID || `${device.modelId}` === WAHOO_KICKR_SNAP_MODEL_ID)) ||
        (`${device.manufacturerId}` === TACX_MANUFACTURER_ID &&
          _.contains(TACX_NEO_MODEL_IDS, `${device.modelId}`))))
  ) {
    sampleRate = EIGHT_HZ;
  }

  const totalMessagesMax = sampleRate * timeAxisTimeSeries.count();

  const failureRate = Math.round(totalRxFails / totalMessagesMax / 0.0001) /
    100;

  // the logging of the sampling is not exact seconds, there could be some overspill into the next second,
  // so the ANT_AVERAGES_WINDOW_IN_SEC averages smooth things out

  // Zero out the N seconds averages that are impossibly high -
  // when there are absolutely no rxfails in ANT_AVERAGES_WINDOW_IN_SEC seconds -
  // usually means a device is completely lost and did not re-pair.

  const filteredRollup = rollup.map(e => {
    // if the ANT_AVERAGES_WINDOW_IN_SEC averag bucket aligns with a
    // `goto search` entry, and no RxFails at all were seen, then this
    // bucket is likely NOT a perfect sample, but rather - no valid sample at all
    // set it to 0 signal

    const interval = indexToUnixTime(e.indexAsString());

    const roundedInterval = parseInt(`${Math.round(interval / ANT_AVERAGES_WINDOW_IN_SEC) * ANT_AVERAGES_WINDOW_IN_SEC}`, 10);

    // the interval is every ANT_AVERAGES_WINDOW_IN_SEC since unix epoc
    // e.g. 3s-12345 is the 12345th 3 second interval since the unix epoc,
    // so multiply out the interval by the ANT_AVERAGES_WINDOW_IN_SEC to get the unix time
    const humanizedTimestamp = secondsToTime(roundedInterval * ANT_AVERAGES_WINDOW_IN_SEC);

    const avgFormatRoundedInterval = `${ANT_AVERAGES_WINDOW_IN_SEC}s-${roundedInterval}`;

    // check the value that coincides with a device search
    if (
      searchesTimestamps &&
      searchesTimestamps.length &&
      _.contains(searchesTimestamps, avgFormatRoundedInterval) &&
      e.get('value') === 0
    ) {
      // return the suspected drop out seconds for surfacing in the charts and textual analysis
      if (!_.contains(dropouts, humanizedTimestamp)) {
        dropouts.push(humanizedTimestamp);
      }
      return e.setData({ value: 0 });
    }

    return e.setData({
      value: sampleRate - e.get('value')
    });
  });

  console.log(`Channel ${device.channel}`);
  console.log(dropouts);

  return {
    timeseries: filteredRollup,
    // the dropouts is an array of the timestamps when the series went to zero
    // at the same time as a goto search event occurred
    dropouts,
    sampleRate,
    failureRate
  };
}
