var _ = require('underscore');

import toArray from './toArray';
import titleCase from './titleCase';
import deviceTypes from '../types/devices.json';
const AntplusDevices = require('zwiftalizer-antplus-devices');

import {
  MAX_DEVICES,
  MAX_MANUFACTURER_ID,
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  WATTBIKE_MANUFACTURER_ID,
  WATTTEAM_MANUFACTURER_ID,
  SMART_TRAINER_MANUFACTURERS,
  POWERMETER_MANUFACTURERS,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  POWERTAP_MODELS,
  CYCLEOPS_TRAINER_MODELS
} from './constants';

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

const antManufacturersRegex = /^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg.*$/i;

export default function antManufacturers(lines) {
  const manufacturerModelItems = [];

  if (!lines) {
    return manufacturerModelItems;
  }

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  const mfgLines = [];

  _.each(antLines, line => {
    antManufacturersRegex.test(line) && mfgLines.push(line);
  });

  if (!mfgLines.length) {
    console.log('no ant manufacturer lines found');
    return manufacturerModelItems;
  }

  const distinctMfgModelEntries = [];

  const j = mfgLines.length;

  for (let i = 0; i < j; i++) {
    const m = mfgLines[i];

    const matches = m.match(
      /^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg\s+?([\d]*)\s+?model\s+?([\d]*)$/i
    );

    if (matches) {
      const extendedDeviceId = parseInt(matches[1]);
      const manufacturerId = parseInt(matches[2]);

      // var because we default some modelsIds to zero, for known manufacturers that have only one device - like wattbike
      var modelId = parseInt(matches[3]);

      if (extendedDeviceId === 0 || manufacturerId === 0) {
        // allow model zero
        continue;
      }

      // saris/cycleops powertap pro+ wireless blurts out all kinds of manufacturer id junk
      // ignore manufacturerIds that a are out of the range of the lookup table
      if (
        extendedDeviceId === 0 ||
        manufacturerId === 0 ||
        manufacturerId >= MAX_MANUFACTURER_ID
      ) {
        continue;
      }

      // The special case of the Tacx Neo, says it's Model 1 and Model 2800, take Model 2800
      // Be sure to check we are not couting model 2800 twice because of this conversion.

      // 2017-05-22, bug, manufacturerId is int but TACX_MANUFACTURER_ID is string. Comparison fails.
      const manufacturerIdString = manufacturerId +'';

      if (manufacturerIdString === TACX_MANUFACTURER_ID && modelId === 1) {
        modelId = 2800;
      }

      const entry = {
        extendedDeviceId,
        manufacturerId,
        modelId
      };

      if (!_.findWhere(distinctMfgModelEntries, entry)) {
        distinctMfgModelEntries.push(entry);
      }
    }
  }

  _.each(distinctMfgModelEntries, m => {
    let type = BASIC_DEVICE;

    const manufacturerIdString = '' + m.manufacturerId;

    var modelIdString = '' + m.modelId;

    // treat kickr as FEC smart trainer, until we know whether or not it is doing its own gradient protocol or FEC standard
    if (_.contains(SMART_TRAINER_MANUFACTURERS, manufacturerIdString)) {
      // set to SMART_TRAINER_DEVICE (smart trainer), but still could be a Saris power meter
      type = SMART_TRAINER_DEVICE;
    } else if (_.contains(POWERMETER_MANUFACTURERS, manufacturerIdString)) {
      type = POWER_METER_DEVICE;
    }

    let deviceId = 0;

    try {
      // get lower 16 bits of the 20 bit number
      // this is critical for lining which channel a device is on when we look at rxfails
      deviceId = parseInt(m.extendedDeviceId) & 0xffff;
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId');
    }

    // try and differentiate between CycleOps and Powertap devices (both  have manufacturer 9)
    if (manufacturerIdString === SARIS_MANUFACTURER_ID) {
      if (_.contains(POWERTAP_MODELS, modelIdString)) {
        type = POWER_METER_DEVICE;
      } else if (_.contains(CYCLEOPS_TRAINER_MODELS, modelIdString)) {
        type = SMART_TRAINER_DEVICE;
      } else {
        // Generic powertap device
        type = POWER_METER_DEVICE;
        m.modelId = 0;
      }
    }
    
    if (manufacturerIdString === WATTTEAM_MANUFACTURER_ID) {
      // PowerBeat
      type = POWER_METER_DEVICE;
      m.modelId = 0;
    }

    if (manufacturerIdString === WATTBIKE_MANUFACTURER_ID) {
      // wattbike
      type = SMART_TRAINER_DEVICE;
      m.modelId = 0;
    }

    // returns undefined if manufacturer not found
    const makeAndModel = AntplusDevices.find(
      manufacturerIdString,
      modelIdString,
      type
    );

    console.log('makeAndModel');
    console.log(makeAndModel);

    const entry = {
      extendedDeviceId: m.extendedDeviceId,
      deviceId,
      manufacturerId: m.manufacturerId,
      manufacturer: makeAndModel ? makeAndModel.manufacturerName : 'Unknown',
      modelId: m.modelId,
      model: makeAndModel ? makeAndModel.modelName : 'Unknown',
      type
    };

    entry.typeName = titleCase(deviceTypes[type]);

    if (entry.model === '') {
      entry.model = 'Unknown';
    }

    manufacturerModelItems.push(entry);
  });

  return manufacturerModelItems;
}
