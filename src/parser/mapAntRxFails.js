var _ = require('underscore')
var sprintf = require('sprintf-js').sprintf
import toArray from './toArray'
import timeAxis from './timeAxis'

var moment = require('moment')

// Speed/Cadence sensor can transmit at these rates
//
// 1. 8102 counts (~4.04Hz, 4 messages/second)
// 2. 16204 counts (~2.02Hz, 2 messages/second)
// 3. 32408 counts (~1.01Hz, 1 message/second)
//
// Ref.
// D00001163_-_ANT+_Device_Profile_-_Bicycle_Speed_and_Cadence_2.0.pdf
// Page 29

const BASIC_DEVICE_SAMPLE_RATE = 4

const BASIC_DEVICE_THRESHOLD = 5

// ANT+ Powermeter
// Data is transmitted from the bike power sensor every 8182/32768 seconds
// (approximately 4.00 Hz)
//
// Ref.
//
// D00001086_-_ANT+_Device_Profile_-_Bicycle_Power_-_Rev4.2.pdf
// Page 19

// Q: So why is Zwift sampling higher than 4 times a second?
// A: Kickr :-p - to get ANT+ power and FE-C

const ADVANCED_DEVICE_SAMPLE_RATE = 8

import {
  Event,
  Collection,
  EventOut,
  Pipeline,
  TimeSeries,
  sum,
  avg
} from 'pondjs'

const antRxFailFmt = '^\\[[^\\]]*\\]\\s+?ant\\s+?:\\s+?rx\\s+?fail\\s+?on\\s+?channel\\s+?%s$'

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapAntRxFails(lines, device, timeAxisTimeSeries) {

  const result = {
    name: 'signal',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines)

  const rxFailRegex = new RegExp(sprintf(antRxFailFmt, device.channel), 'i');

  const fails = []

  _.each(antLines, line => {
    rxFailRegex.test(line) && fails.push(line)
  })

  // fails is only for the current channel, so now count them in each distinct timeslot
  _.each(fails, line => {

    const matches = line.match(/^\[([^\]]*)\].*$/i)

    if (!matches) {
      return
    }

    try {
      const timestamp = parseInt(matches[1])
      const value = 1
      result.points.push([timestamp, value])
    } catch (e) {
      console.log('Failed to parse ant rx fail time entry', e)
    }

  })

  const ts = new TimeSeries(result)

  const mergedSeries = TimeSeries.timeSeriesListSum({
    name: 'signal',
    columns: ['time', 'value'],
  }, [timeAxisTimeSeries, ts])

  const rollup = mergedSeries.fixedWindowRollup('1s', {
    value: sum
  })

  const maxValue = rollup.max()

  // this is sketch, says - it is a basic device if the max rxfail per second is equal to or less than
  // the basic sample rate (assumed to be 4hz).

  const basic = maxValue <= BASIC_DEVICE_THRESHOLD

  // assumption 1 - basic devices (HR, Cadence, Speed) are sampled no more than 4 times a second
  // assumption 2 - advanced devices, like powermeters are sampled 8 times a second
  // this logic is a bit flawed because there could be a very reliable basic device that ever has a max value above 4

  const sampleRate = basic ? BASIC_DEVICE_SAMPLE_RATE : ADVANCED_DEVICE_SAMPLE_RATE

  // make each 1 second value equal to the full, assumed sample rate (based on avg # of fails) minus the sum of RxFails
  // what we are trying to do here is get the SUCCESSES by
  // subtracting the fails from the sample rate

  // e.g. 4 - 0 =  4 successful message received
  // e.g. 4 - 1 =  3 successful message received
  // e.g. 4 - 2 =  2 successful message received
  // e.g. 4 - 3 =  1 successful message received
  // e.g. 4 - 4 =  0 successful message received ----> a gap

  const filteredRollup = rollup.map(e =>

    // powermeters almost never have 8 messages in 1 second
    // so if rxfail count is zero, and sample rate is 8,
    // then assume no signal was emitted at all.

    e.setData({
      value: sampleRate - e.get('value') === ADVANCED_DEVICE_SAMPLE_RATE ? 0 : sampleRate - e.get('value')
    })
  )

  return filteredRollup

}
