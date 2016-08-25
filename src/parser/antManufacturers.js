var _ = require('underscore')

import toArray from './toArray'
import titleCase from './titleCase'
import manufacturersLookup from '../types/antCyclingManufacturers.json'

import tacxDevices from '../types/tacx.json'
import wahooDevices from '../types/wahoo.json'

import {
  MAX_DEVICES,
  MAX_MANUFACTURER_ID,
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID,
  SMART_TRAINER_MANUFACTURERS,
  POWERMETER_MANUFACTURERS,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  FEC_DEVICE,
  WAHOO_KICKR_DEVICE
} from './constants'

// we know battery level is coming from powermeter if we know
// dID 743018 is quark PM
// [10:58:44] ANT  : dID 743018 Battery Level 3

// [10:58:44] ANT  : dID 743018 SW Revision 6912 SerialNum 1462654570
// Report Powermeter = Quarq, Software Revision 6912

/**
 * Returns an array of ant+ device manufacturer Ids
 * where each element of the array is an object with the following properties
 * {
 *  extendedDeviceId: <string>,
 *  manufacturerId: <string>,
 *  modelNumber: <string>
 }
 * @param {[string]} lines - an array of log lines, or string
 */

const antManufacturersRegex = /^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg.*$/i

export default function antManufacturers(lines) {

  const manufacturers = []

  if (!lines) {
    return manufacturers
  }

  const antLines = Array.isArray(lines) ? lines : toArray(lines)

  const mfgLines = []

  _.each(antLines, line => {
    antManufacturersRegex.test(line) && mfgLines.push(line)
  })

  if (!mfgLines.length) {
    console.log('no ant manufacturer lines found')
    return manufacturers
  }

  _.some(mfgLines, m => {

    const matches = m.match(/^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg\s+?([\d]*)\s+?model\s+?([\d]*)$/i)

    if (!matches) {
      console.log('Failed to extract extendedDeviceId, manufacturer, model from manufacturer line')
      return
    }

    // extendedDeviceId and manufacturerId must be numbers else they would not have passed the regex test
    const extendedDeviceId = matches[1]
    const manufacturerId = matches[2]
    const modelId = matches[3]

    // yes, allow model to be 0
    if (!extendedDeviceId || !manufacturerId) {
      console.log('Failed to get values for ant extendedDeviceId, manufacturer')
      return;
    }

    // saris/cycleops powertap pro+ wireless blurts out all kinds of manufacturer id junk
    // ignore manufacturerIds that a are out of the range of the lookup table
    if (parseInt(manufacturerId) > MAX_MANUFACTURER_ID) {
      return;
    }

    let type = BASIC_DEVICE

    if (_.contains(SMART_TRAINER_MANUFACTURERS, manufacturerId)) {
      type = FEC_DEVICE
    } else if (_.contains(POWERMETER_MANUFACTURERS, manufacturerId)) {
      type = POWER_METER_DEVICE
    }

    // could still be an old powertap that doesn't broadcast manufacturer properly
    // in which case, type will still be BASIC_DEVICE
    let deviceId = 0

    try {
      // get lower 16 bits of the 20 bit number
      deviceId = parseInt(extendedDeviceId) & 0xFFFF
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId')
    }

    // get manufacturer name and model (for ones we have lookups on)
    let manufacturer = ''

    if (_(manufacturersLookup).has(manufacturerId)) {
      manufacturer = titleCase(manufacturersLookup[manufacturerId])
    }

    let model = ''

    if (modelId) {

      const manufacturerIdSting = '' + manufacturerId

      // try and get model strings for the manufacturers that do this type of thing
      switch (manufacturerIdSting) {

        case (WAHOO_MANUFACTURER_ID):
          // treat kickr as if it is both powermeter and fec device
          type = WAHOO_KICKR_DEVICE
            // pretty sure now that device is a kickr or kickr snap
            // (we will handle the ant+fec data stream in a different way to other devices)
          if (_(wahooDevices).has(modelId)) {
            model = titleCase(wahooDevices[modelId])
          }
          break;

        case (TACX_MANUFACTURER_ID):
          if (_(tacxDevices).has(modelId)) {
            model = titleCase(tacxDevices[modelId])
          }
          break;

          //@todo, all the models!
          //@todo, shouldn't be too difficult to get Elite model ids

        default:
          break;
      }
    }

    let entry = {
      extendedDeviceId,
      deviceId,
      manufacturerId,
      manufacturer,
      modelId,
      model,
      type
    }

    if (!_.findWhere(manufacturers, entry)) {
      manufacturers.push(entry);
    }

    // _.some(array, f(x)) breaks if f(x) returns true
    // this is the predeciate that says 'we have some' devices
    if (manufacturers.length === MAX_DEVICES) {
      return true;
    }

  })

  return manufacturers
}
