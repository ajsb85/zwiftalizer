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
import mapAntBatteryLevels from './mapAntBatteryLevels'
import mapAntRxFails from './mapAntRxFails'
import mapPowermeterData from './mapPowermeterData'
import mapGradientData from './mapGradientData'
import mapCalibrationData from './mapCalibrationData'

const BASIC_DEVICE_SAMPLE_RATE = 4

export default function antData(log, timeAxisTimeSeries) {

  const antLines = mapAntLines(log)

  const devices = antDevices(antLines)

  const manufacturers = antManufacturers(antLines)

  const batteryLevels = mapAntBatteryLevels(antLines)

  const searches = mapAntSearches(antLines, timeAxisTimeSeries)

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

    const batteryLevel = _.find(batteryLevels, b => {
      return b.deviceId === device.deviceId
    })

    if (batteryLevel) {
      Object.assign(device, batteryLevel)
    }

    switch (device.type) {

      case (POWER_METER_DEVICE):
        {
          const calibration = mapCalibrationData(antLines)

          const power = mapPowermeterData(antLines, timeAxisTimeSeries)
          Object.assign(device, {
            power,
            calibration
          })
        }
        break

        // kickr, doing its own thing, not FE-C standard when setting gradient
        // and looks like a regular ANT+ powermeter
      case (WAHOO_KICKR_DEVICE):
        {
          const power = mapPowermeterData(antLines, timeAxisTimeSeries)
          const gradient = mapGradientData(antLines, timeAxisTimeSeries)
          Object.assign(device, {
            power,
            gradient
          })
        }
        break

        //TACX, BKOOL, ELITE, or Kickr using FE-C beta, sets gradient, power over fec, does not look like a regular ANT+ powermeter
      case (FEC_DEVICE):
        {
          const gradient = mapGradientData(antLines, timeAxisTimeSeries)
          Object.assign(device, {
            gradient
          })
        }
        break

      default:
        {}
        break

    }
  })

  return Object.freeze({
    devices,
    searches
  })
}
