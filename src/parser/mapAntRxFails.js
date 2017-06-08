import { TimeSeries, avg } from 'pondjs';

import toArray from './toArray';

import indexToUnixTime from './indexToUnixTime';

import {
  WAHOO_MANUFACTURER_ID,
  WAHOO_KICKR_MODEL_ID,
  TACX_MANUFACTURER_ID,
  TACX_NEO_MODEL_IDS,
  POWER_METER_DEVICE,
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

  const minValue = mergedSeries.min();
  const maxValue = mergedSeries.max();

  // N second avg of fails
  const rollup = mergedSeries.fixedWindowRollup({
    windowSize: `${ANT_AVERAGES_WINDOW_IN_SEC}s`,
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  // assumption 1 - basic devices (HR, Cadence, Speed) are sampled no more than 4 times a second
  // assumption 2 - advanced devices, like powermeters are sampled 8 times a second

  let sampleRate = FOUR_HZ;

  // Try to use device manufacturerId and modelId to make a better guess
  // at whether the device is sampled at 4HZ or 8HZ.
  // If the max number of RxFails is higher than 5, then use 8Hz
  // And if the device is either known to be a Power meter, Kickr or Neo then use 8HZ
  if (
    maxValue > FOUR_HZ + 1 ||
    device.type === POWER_METER_DEVICE ||
    (device.manufacturerId &&
      device.modelId &&
      ((`${device.manufacturerId}` === WAHOO_MANUFACTURER_ID &&
        `${device.modelId}` === WAHOO_KICKR_MODEL_ID) ||
        (`${device.manufacturerId}` === TACX_MANUFACTURER_ID &&
          _.contains(TACX_NEO_MODEL_IDS, `${device.modelId}`))))
  ) {
    sampleRate = EIGHT_HZ;
  }

  const totalSamples = sampleRate * timeAxisTimeSeries.count();

  const failureRate = Math.round(totalRxFails / totalSamples / 0.0001) / 100;

  // console.log(failureRate);

  // Hack, power meters that were expected to be EIGHT_HZ
  // but are actually 4HZ show a 40 to 50% failure rate,
  // Make this normal again by subracting the failureRate from 50 (not 100).

  // if (failureRate > 40 && sampleRate === EIGHT_HZ) {
  //   const totalExpectedFailures = FOUR_HZ * timeAxisTimeSeries.count();

  //   const adjustedTotalRxFails = totalRxFails - totalExpectedFailures;

  //   failureRate = Math.round(adjustedTotalRxFails / totalSamples / 0.0001) /
  //     100;
  // }

  // const medianValue = mergedSeries.median();

  // const meanValue = mergedSeries.mean();

  // const stdev = mergedSeries.stdev();

  // console.log(`totalRxFails ${totalRxFails}`);

  // console.log(`totalSeconds ${timeAxisTimeSeries.count()}`);

  // console.log(`totalSamples ${totalSamples}`);

  // console.log(`failureRate rate ${failureRate}`);

  console.log(`maxValue ${maxValue}`);

  console.log(`minValue ${minValue}`);

  // console.log(`medianValue ${medianValue}`);

  // console.log(`meanValue ${meanValue}`);

  // console.log(`stdev ${stdev}`);

  // the logging of the sampling is not exact seconds, there could be some overspill into the next second,
  // so the 2s averages smooth things out

  // Zero out the N seconds averages that are impossibly high -
  // when there are absolutely no rxfails in 10 seconds -
  // usually means a device is completely lost and did not re-pair.

  const filteredRollup = rollup.map(e => {
    // if the 2 second averag bucket aligns with a
    // `goto search` entry, and no RxFails at all were seen, then this
    // bucket is likely NOT a perfect sample, but rather - no valid sample at all
    // set it to 0 signal

    const timestamp = indexToUnixTime(e.indexAsString());

    const roundedTimeStamp = `${ANT_AVERAGES_WINDOW_IN_SEC}s-${Math.round(timestamp / ANT_AVERAGES_WINDOW_IN_SEC) * ANT_AVERAGES_WINDOW_IN_SEC}`;

    // check the value that coincides with a device search
    if (
      searchesTimestamps &&
      searchesTimestamps.length &&
      _.contains(searchesTimestamps, roundedTimeStamp) &&
      e.get('value') === 0
    ) {
      // return the suspected drop out seconds for surfacing in the charts and textual analysis
      dropouts.push(roundedTimeStamp);
      // console.log(
      //   `${JSON.stringify(e)} channel ${device.channel} device ${device.deviceId} is likely the cause of the re-pairing / goto search`
      // );
      return e.setData({ value: sampleRate });
    }

    return e.setData({ value: maxValue - e.get('value') });
  });

  return {
    timeseries: filteredRollup,
    dropouts,
    sampleRate,
    failureRate
  };
}
