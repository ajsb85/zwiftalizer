var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;
import toArray from './toArray';
import timeAxis from './timeAxis';
import { nonZeroAvgReducer } from './functions';
import indexToUnixTime from './indexToUnixTime.js';
import { SECONDS_TO_ROUND_RECONNECT_TIME } from './constants';

// Speed/Cadence sensor can transmit at these rates
//
// 1. 8102 counts (~4.04Hz, 4 messages/second)
// 2. 16204 counts (~2.02Hz, 2 messages/second)
// 3. 32408 counts (~1.01Hz, 1 message/second)
//
// Ref.
// D00001163_-_ANT+_Device_Profile_-_Bicycle_Speed_and_Cadence_2.0.pdf
// Page 29

const BASIC_DEVICE_SAMPLE_RATE = 4.0;

const BASIC_DEVICE_THRESHOLD_MAX_FAILS = BASIC_DEVICE_SAMPLE_RATE;

// ANT+ Powermeter
// Data is transmitted from the bike power sensor every 8182/32768 seconds
// (approximately 4.00 Hz)
//
// Ref.
//
// D00001086_-_ANT+_Device_Profile_-_Bicycle_Power_-_Rev4.2.pdf
// Page 19

const ADVANCED_DEVICE_SAMPLE_RATE = 8.0;

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

  // SECONDS_TO_ROUND_RECONNECT_TIME avg of fails
  const rollup = mergedSeries.fixedWindowRollup({
    windowSize: `${SECONDS_TO_ROUND_RECONNECT_TIME}s`,
    aggregation: {
      value: {
        value: avg()
      }
    }
  });

  const maxValue = rollup.max();
  console.log('maxValue');
  console.log(maxValue);

  const medianValue = sampleRate - rollup.median();
  console.log('medianValue');
  console.log(medianValue);

  // console.log('device rxFail max value');
  // console.log(maxValue);

  // assumption 1 - basic devices (HR, Cadence, Speed) are sampled no more than 4 times a second
  // assumption 2 - advanced devices, like powermeters are sampled 8 times a second

  let sampleRate = BASIC_DEVICE_SAMPLE_RATE;
  //let highSignalThreshold = BASIC_DEVICE_SAMPLE_RATE;

  // this could be unreliable, it says - it is a basic device if the max rxfail per second is less than
  // or equal to the basic sample rate (assumed to be 4hz).

  // @todo, try to use device manufacturerId and modelId to make a better guess
  // at whether the device is sampled at 4HZ or 8HZ

  const isBasic = maxValue <= BASIC_DEVICE_THRESHOLD_MAX_FAILS;

  if (!isBasic) {
    sampleRate = ADVANCED_DEVICE_SAMPLE_RATE;
    //highSignalThreshold = ADVANCED_DEVICE_SAMPLE_RATE * 0.95;
  }

  // make each 10 second avg value equal to the full, assumed sample rate (based on avg # of fails) minus the 
  // avg of RxFails in that 10 seconds
  // what we are trying to do here is get the SUCCESSES by
  // subtracting the fails from the sample rate

  // e.g. 40 - 0 =  40 successful message received
  // e.g. 40 - 10 =  30 successful message received
  // e.g. 40 - 20 =  20 successful message received
  // e.g. 40 - 30 =  10 successful message received ---> weak signal, possibly an indication of drop outs
  // e.g. 40 - 40 =  0 successful message received ----> a drop out - problem is - when a device is completely lost, there are no rxfails at all, so it appears to be a strong signal

  // the logging of the sampling is not exact seconds, there could be some overspil into the next second, so the 10s averages smooth things out

  // these might be interesting stats to add to the reports
  
  const seventyFifthPercentile = sampleRate - rollup.percentile(75);
  console.log('seventyFifthPercentile');
  console.log(seventyFifthPercentile);

  const ninetiethPercentile = sampleRate - rollup.percentile(90);
  console.log('ninetiethPercentile');
  console.log(ninetiethPercentile);

  // @todo, get the median RxFails per manufacturerId modelId key

  // zero out the SECONDS_TO_ROUND_RECONNECT_TIME averages that are below the threshold we `think`
  // triggers a re-pairig (goto search).
  // Also zero out the SECONDS_TO_ROUND_RECONNECT_TIME averages that are impossibly high -
  // when there are absolutely no rxfails in 10 seconds -
  // usually means a device is completely lost and did not re-pair.

  const filteredRollup = rollup.map(e => {
    const event = JSON.parse(e);

    // if the 10 second bucket aligns with a
    // `goto search` entry, and no RxFails at all were seen, then this
    // bucket is likely NOT a perfect sample, but rather - no valid sample at all
    // set it to 0 signal

    const timestamp = indexToUnixTime(event.index);

    const roundedTimeStamp = `${SECONDS_TO_ROUND_RECONNECT_TIME}s-${Math.round(timestamp / SECONDS_TO_ROUND_RECONNECT_TIME) * SECONDS_TO_ROUND_RECONNECT_TIME}`;

    if (
      searchesTimestamps &&
      searchesTimestamps.length &&
      searchesTimestamps.includes(roundedTimeStamp) &&
      event.data.value <
        1 /* low SECONDS_TO_ROUND_RECONNECT_TIME second average rx fails, not because the device is good, but becuase it's gone!*/
    ) {
      // return the suspected drop out seconds for surfacing in the charts and textual analysis
      dropouts.push(roundedTimeStamp);
      // console.log(JSON.stringify(event), ' is likely the cause of the re-pairing / goto search');
      // @todo, set a flag that says this device had at least one suspected drop out in a 10 second period
      return e.setData(0);
    } else {
      // set to 0 any signal that is not in range of a searchesTimestamps
      // but is sort of perfect, which is highly unlikely
      // return e.setData({
      //   value: sampleRate - e.get('value') > highSignalThreshold
      //     ? 0
      //     : sampleRate - e.get('value')
      // });
      return e.setData({value: sampleRate - e.get('value')})
    }
  });

  return {
    timeseries: filteredRollup,
    dropouts,
    isBasic
  };
}
