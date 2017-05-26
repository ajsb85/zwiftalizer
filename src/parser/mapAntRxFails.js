var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;
import toArray from './toArray';
import timeAxis from './timeAxis';
import { nonZeroAvgReducer } from './functions';
import indexToUnixTime from './indexToUnixTime.js';

// Speed/Cadence sensor can transmit at these rates
//
// 1. 8102 counts (~4.04Hz, 4 messages/second)
// 2. 16204 counts (~2.02Hz, 2 messages/second)
// 3. 32408 counts (~1.01Hz, 1 message/second)
//
// Ref.
// D00001163_-_ANT+_Device_Profile_-_Bicycle_Speed_and_Cadence_2.0.pdf
// Page 29
const _4HZ = 4.0;

// ANT+ Powermeter
// Data is transmitted from the bike power sensor every 8182/32768 seconds
// (approximately 4.00 Hz)
//
// Ref.
//
// D00001086_-_ANT+_Device_Profile_-_Bicycle_Power_-_Rev4.2.pdf
// Page 19

const _8HZ = 8.0;

import {
  WAHOO_MANUFACTURER_ID,
  WAHOO_KICKR_MODEL_ID,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  ANT_AVERAGES_WINDOW_IN_SEC
} from './constants';

import {
  Event,
  Collection,
  EventOut,
  Pipeline,
  TimeSeries,
  sum,
  avg
} from 'pondjs';

const antRxFailFmt = '^\\[[^\\]]*\\]\\s+?ant\\s+?:\\s+?rx\\s+?fail\\s+?on\\s+?channel\\s+?%s$';

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapAntRxFails(
  lines,
  device,
  timeAxisTimeSeries,
  searchesTimestamps
) {
  let isBasic = true;

  const dropouts = [];

  const result = {
    name: 'signal',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  const rxFailRegex = new RegExp(sprintf(antRxFailFmt, device.channel), 'i');

  const fails = [];

  _.each(antLines, line => {
    rxFailRegex.test(line) && fails.push(line);
  });

  // fails is only for the current channel, so now count them in each distinct timeslot
  _.each(fails, line => {
    const matches = line.match(/^\[([^\]]*)\].*$/i);

    if (!matches) {
      return;
    }

    try {
      const timestamp = parseInt(matches[1]);
      const value = 1;
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

  // N second avg of fails
  const rollup = mergedSeries.fixedWindowRollup({
    windowSize: `${ANT_AVERAGES_WINDOW_IN_SEC}s`,
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  const maxValue = rollup.max() / ANT_AVERAGES_WINDOW_IN_SEC;
  console.log('maxValue');
  console.log(maxValue);

  const medianValue = rollup.median() / ANT_AVERAGES_WINDOW_IN_SEC;
  console.log('medianValue');
  console.log(medianValue);

  // assumption 1 - basic devices (HR, Cadence, Speed) are sampled no more than 4 times a second
  // assumption 2 - advanced devices, like powermeters are sampled 8 times a second

  let sampleRate = _4HZ;

  // Try to use device manufacturerId and modelId to make a better guess
  // at whether the device is sampled at 4HZ or 8HZ

  // using type coercion == on manufacturerId (int) and WAHOO manufacturer const (string)
  if (
    device.type === POWER_METER_DEVICE ||
    (device.manufacurerId &&
      device.manufacurerId == WAHOO_MANUFACTURER_ID &&
      device.modelId &&
      device.modelId == WAHOO_KICKR_MODEL_ID)
  ) {
    isBasic = false;
    sampleRate = _8HZ;    
  }

  // the logging of the sampling is not exact seconds, there could be some overspill into the next second, so the 2s averages smooth things out

  // these might be interesting stats to add to the reports

  const seventyFifthPercentile = sampleRate - rollup.percentile(75) / ANT_AVERAGES_WINDOW_IN_SEC;
  console.log('seventyFifthPercentile');
  console.log(seventyFifthPercentile);

  const ninetiethPercentile = sampleRate - rollup.percentile(90) / ANT_AVERAGES_WINDOW_IN_SEC;
  console.log('ninetiethPercentile');
  console.log(ninetiethPercentile);

  // zero out the N seconds averages that are below the threshold we `think`
  // triggers a re-pairig (goto search).
  // Also zero out the N seconds averages that are impossibly high -
  // when there are absolutely no rxfails in 10 seconds -
  // usually means a device is completely lost and did not re-pair.

  const filteredRollup = rollup.map(e => {
    const event = JSON.parse(e);

    // if the 10 second bucket aligns with a
    // `goto search` entry, and no RxFails at all were seen, then this
    // bucket is likely NOT a perfect sample, but rather - no valid sample at all
    // set it to 0 signal
    const timestamp = indexToUnixTime(event.index);

    const roundedTimeStamp = `${ANT_AVERAGES_WINDOW_IN_SEC}s-${Math.round(timestamp / ANT_AVERAGES_WINDOW_IN_SEC) * ANT_AVERAGES_WINDOW_IN_SEC}`;

    // check the value that coincides with a device search is not zero
    if (
      searchesTimestamps &&
      searchesTimestamps.length &&
      _.contains(searchesTimestamps, roundedTimeStamp) &&
      event.data.value === 0
    ) {
      // return the suspected drop out seconds for surfacing in the charts and textual analysis
      dropouts.push(roundedTimeStamp);
      console.log(JSON.stringify(event), ' is likely the cause of the re-pairing / goto search');
      // @todo, set a flag that says this device had at least one suspected drop out in a 10 second period
      return e;
    } else {            
      return e.setData({ value: sampleRate - e.get('value') });
    }
  });

  return {
    timeseries: filteredRollup,
    dropouts,
    isBasic
  };
}
