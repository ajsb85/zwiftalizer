var _ = require('underscore')

import {
  WAHOO_MANUFACTURER_ID,
  WAHOO_KICKR_MODEL_ID,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  FEC_DEVICE,
  WAHOO_KICKR_DEVICE
} from './constants'

import mapAntLines from './mapAntLines'
import antDevices from './antDevices'
import antManufacturers from './antManufacturers'
import mapAntSearches from './mapAntSearches'
import mapAntRxFails from './mapAntRxFails'
import mapPowermeterData from './mapPowermeterData'
import mapGradientData from './mapGradientData'
import mapCalibrationData from './mapCalibrationData'

import {
  TimeSeries,
} from 'pondjs'

const BASIC_DEVICE_SAMPLE_RATE = 4

export default function antData(log, timeAxisTimeSeries) {

  const antLines = mapAntLines(log)

  const devices = antDevices(antLines)

  const manufacturers = antManufacturers(antLines)

  const searches = mapAntSearches(antLines, timeAxisTimeSeries)

  const power = mapPowermeterData(antLines, timeAxisTimeSeries)

  const calibration = mapCalibrationData(antLines)

  // get failures for each device, and map in the manufacturer, if known
  _.each(devices, device => {

    const manufacturer = _.find(manufacturers, m => {
      return m.deviceId === device.deviceId
    })

    // this is where device type gets set
    if (manufacturer) {
      Object.assign(device, manufacturer)
    }

    // always get rxfails for the channel because it can reveal
    // if a device is being sampled at a high rate (probably a power source)
    const signal = mapAntRxFails(antLines, device, timeAxisTimeSeries)

    // last ditch attempt to find the powermeter
    // rxfail pattern does not look like a basic device,
    // is not already detected as being made by a PM manufacturer (could be saris, powertap)
    // and is not a FEC_DEVICE, or KICKR
    if (signal.max() > BASIC_DEVICE_SAMPLE_RATE && device.type === BASIC_DEVICE) {
      device.type = POWER_METER_DEVICE
    }

    Object.assign(device, {
      signal,
    })

  })

  const powerDevice = _.find(devices, device => {
    return (device.type === POWER_METER_DEVICE)
  })

  const kickrDevice = _.find(devices, device => {
    return (device.type === FEC_DEVICE && device.manufacturerId === WAHOO_MANUFACTURER_ID)
  })

  // can be kickr again
  const fecSmartTrainerDevice = _.find(devices, device => {
    return (device.type === FEC_DEVICE)
  })

  // assign the power data to the powermeter before the kickr, but never both
  if (powerDevice) {
    Object.assign(powerDevice, {
      power,
      calibration
    })
  } else if (kickrDevice) {
    // kickr does not emit calibration offset
    Object.assign(kickrDevice, {
      power
    })
  }

  // if power was assigned to powermeter device, then kickrDevice.power will be undefined
  //  assign a null power timeseries to kickr
  if (kickrDevice && !kickrDevice.power) {

    const power = new TimeSeries({
      name: 'power',
      columns: ['time', 'value'],
      points: []
    })

    const reducedPowerSeries = TimeSeries.timeSeriesListSum({
      name: 'power',
      fieldSpec: ['time', 'value'],
      seriesList: [timeAxisTimeSeries, power]
    })

    Object.assign(kickrDevice, {
      power: reducedPowerSeries
    })
  }

  if (fecSmartTrainerDevice) {
    const gradient = mapGradientData(antLines, timeAxisTimeSeries)
    Object.assign(fecSmartTrainerDevice, {
      gradient
    })
  }

  return Object.freeze({
    devices,
    searches
  })
}
