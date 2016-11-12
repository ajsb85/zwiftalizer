var _ = require('underscore')
var sprintf = require('sprintf-js').sprintf;
import toArray from './toArray'

var moment = require('moment')

import {
  TimeSeries,
  avg
} from 'pondjs'

export const gradientEntryRegex = /^\[[^\]]*\]\s+ant\s+:\s+(fet|kickr)\s+changing\s+grade.*$/i

// lines is assumed to be ANT FEC lines only, as an array, with times already in unix format using epochify
export default function mapGradientData(lines, timeAxisTimeSeries) {

  const result = {
    name: 'gradient',
    columns: ['time', 'value'],
    points: []
  };

  const antLines = Array.isArray(lines) ? lines : toArray(lines)

  // map out all the gradient change lines first
  const gradientChangeLines = []

  _.each(antLines, line => {
    gradientEntryRegex.test(line) && gradientChangeLines.push(line)
  })

  if (!gradientChangeLines.length) {
    return new TimeSeries(result)
  }

  // now capture the time and the avg power reading
  _.each(gradientChangeLines, line => {

    const matches = line.match(/^\[([^\]]*)\]\s+ant\s+:\s+(fet|kickr)\s+changing\s+grade\s+to\s+([+\-\.\d]+).*$/i)

    if (!matches) {
      console.log('Failed to extract gradient change entry')
      return
    }

    try {

      const timestamp = parseInt(matches[1])

      const type = matches[2]

      let value = parseFloat(matches[3])

      if (type && type.toLowerCase() === 'kickr') {
        value = value / 100
      }

      result.points.push([timestamp, value])

    } catch (e) {
      console.log('Failed to parse timestamp as int and gradient change entry as float', e)
    }

  })

  if (result.points.length === 0) {
    return new TimeSeries(result)
  }

  const ts = new TimeSeries(result);

  const gradientTimeSeries = new TimeSeries(result);

  const rollup = gradientTimeSeries.fixedWindowRollup({
    windowSize: '1s',
    aggregation: {
      value: {
        value: avg()
      }
    }
  })

  return rollup
}
