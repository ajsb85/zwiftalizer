var _ = require('underscore')

import {
  TimeSeries,
  max
} from 'pondjs'

import toArray from './toArray'

// lines is assumed to be Networking lines only, as an array, with times already in unix format using epochify
export default function mapNetworkErrors(lines, timeAxisTimeSeries) {

  const result = {
    name: 'errors',
    columns: ['time', 'value'],
    points: []
  };

  const networkLines = Array.isArray(lines) ? lines : toArray(lines)

  const errorsRegex = /^\[[^\]]*\]\s+network:error.*$/i

  const errors = []

  _.each(networkLines, line => {
    errorsRegex.test(line) && errors.push(line)
  })

  _.each(errors, line => {

    const matches = line.match(/^\[([^\]]*)\].*$/i)

    if (!matches) {
      return
    }

    const timestamp = parseInt(matches[1])

    result.points.push([timestamp, 1])

  })

  const ts = new TimeSeries(result)

  const reducedSeries = TimeSeries.timeSeriesListSum({
    name: 'errors',
    columns: ['time', 'value'],
  }, [timeAxisTimeSeries, ts])

  // rollup max to exaggerate the reconnects bars
  const rollup = reducedSeries.fixedWindowRollup('10s', {
    value: max
  })

  return rollup

}
