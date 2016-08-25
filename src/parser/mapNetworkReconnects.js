var _ = require('underscore')

import {
  TimeSeries,
  max
} from 'pondjs'

import toArray from './toArray'

// lines is assumed to be Networking lines only, as an array, with times already in unix format using epochify
export default function mapNetworkReconnects(lines, timeAxisTimeSeries) {

  const result = {
    name: 'reconnects',
    columns: ['time', 'value'],
    points: []
  };

  const networkLines = Array.isArray(lines) ? lines : toArray(lines)

  const reconnectsRegex = /^\[[^\]]*\]\s+netclient:reconnection\srequested$/i

  const reconnects = []

  _.each(networkLines, line => {
    reconnectsRegex.test(line) && reconnects.push(line)
  })

  _.each(reconnects, line => {

    const matches = line.match(/^\[([^\]]*)\].*$/i)

    if (!matches) {
      return
    }

    const timestamp = parseInt(matches[1])

    result.points.push([timestamp, 1])

  })

  const ts = new TimeSeries(result)

  const reducedSeries = TimeSeries.timeSeriesListSum({
    name: 'reconnects',
    columns: ['time', 'value'],
  }, [timeAxisTimeSeries, ts])

  // rollup max to exaggerate the reconnects bars
  const rollup = reducedSeries.fixedWindowRollup('10s', {
    value: max
  })

  return rollup

}
