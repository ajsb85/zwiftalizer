var _ = require('underscore')

import {
  TimeSeries,
  max
} from 'pondjs'

import toArray from './toArray'

// lines is assumed to be Networking lines only, as an array, with times already in unix format using epochify
export default function mapNetworkErrors(lines, timeAxisTimeSeries) {

  const networkErrors = {
    name: 'errors',
    columns: ['time', 'value'],
    points: []
  };

  const delayedPackets = {
    name: 'delayedPackets',
    columns: ['time', 'value'],
    points: []
  };

  const invalidRoadTimeWarnings = {
    name: 'invalidRoadTimeWarnings',
    columns: ['time', 'value'],
    points: []
  };

  const networkLines = Array.isArray(lines) ? lines : toArray(lines)

  const errorsRegex = /^\[[^\]]*\]\s+(network:error|network:delayed|warn\s+:\s+invalid\sroad\stime).*$/i

  const errors = []

  _.each(networkLines, line => {
    errorsRegex.test(line) && errors.push(line)
  })

  _.each(errors, line => {

    const matches = line.match(/^\[([^\]]*)\]\s+(network:error|network:delayed|warn\s+:\s+invalid\sroad\stime).*$/i)

    if (!matches) {
      return
    }

    const timestamp = parseInt(matches[1])

    const type = matches[2]

    let errorType = null

    try {
      errorType = (type.split(':')[1]).toLowerCase().trim()
    } catch (e) {
      console.log('Failed to parse network error type')
      return
    }

    switch (errorType) {

      case ('error'):
        {
          networkErrors.points.push([timestamp, 1])
        }
        break

      case ('delayed'):
        {
          delayedPackets.points.push([timestamp, 1])
        }
        break

      case ('invalid road time'):
        {
          invalidRoadTimeWarnings.points.push([timestamp, 1])
        }
        break
    }

  })

  const networkErrorsTs = new TimeSeries(networkErrors)

  const reducedNetworkErrors = TimeSeries.timeSeriesListSum({
    name: 'errors',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, networkErrorsTs]
  })

  const rollupNetworkErrors = reducedNetworkErrors.fixedWindowRollup({
    windowSize: '10s',
    aggregation: {
      value: {
        value: max()
      }
    }
  })

  const delayedPacketsTs = new TimeSeries(delayedPackets)

  const reducedDelayedPackets = TimeSeries.timeSeriesListSum({
    name: 'delayedPackets',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, delayedPacketsTs]
  })

  const rollupDelayedPackets = reducedDelayedPackets.fixedWindowRollup({
    windowSize: '10s',
    aggregation: {
      value: {
        value: max()
      }
    }
  })

  const reducedInvalidRoadTimeWarningsTs = new TimeSeries(invalidRoadTimeWarnings)

  const reducedInvalidRoadTimeWarnings = TimeSeries.timeSeriesListSum({
    name: 'invalidRoadTimeWarnings',
    fieldSpec: ['time', 'value'],
    seriesList: [timeAxisTimeSeries, reducedInvalidRoadTimeWarningsTs]
  })

  const rollupInvalidRoadTimeWarnings = reducedInvalidRoadTimeWarnings.fixedWindowRollup({
    windowSize: '10s',
    aggregation: {
      value: {
        value: max()
      }
    }
  })

  return {
    generalErrors: rollupNetworkErrors,
    delayedPackets: rollupDelayedPackets,
    invalidRoadTimeWarnings: rollupInvalidRoadTimeWarnings
  }

}
