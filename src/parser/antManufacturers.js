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
  BKOOL_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID,
  GARMIN_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  SAXONAR_MANUFACTURER_ID,
  FOUREYES_MANUFACTURER_ID,
  STAGES_MANUFACTURER_ID,
  SMART_TRAINER_MANUFACTURERS,
  POWERMETER_MANUFACTURERS,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  SARIS_HAMMER_MODEL_ID,
  POWERTAP_MODELS
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

    // saris/cycleops powertap pro+ wireless blurts out all kinds of manufacturer id junk
    // ignore manufacturerIds that a are out of the range of the lookup table
    if (matches) {
      const extendedDeviceId = parseInt(matches[1]);
      const manufacturerId = parseInt(matches[2]);
      const modelId = parseInt(matches[3]);

      if (
        matches[1] === 0 ||
        matches[2] === 0 ||
        matches[2] >= MAX_MANUFACTURER_ID
      ) {
        continue;
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
    const modelIdString = '' + m.modelId;

    // treat kickr as FEC smart trainer, until we know whether or not it is doing its own gradient protocol or FEC standard
    if (_.contains(SMART_TRAINER_MANUFACTURERS, manufacturerIdString)) {
      // set to SMART_TRAINER_DEVICE (smart trainer), but still could be a Saris power meter
      type = SMART_TRAINER_DEVICE;
    } else if (_.contains(POWERMETER_MANUFACTURERS, manufacturerIdString)) {
      type = POWER_METER_DEVICE;
    }
    // could still be an old powertap that doesn't broadcast manufacturer properly
    // in which case, type will still be BASIC_DEVICE

    let deviceId = 0;

    try {
      // get lower 16 bits of the 20 bit number
      deviceId = parseInt(m.extendedDeviceId) & 0xffff;
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId');
    }

    // try and differentiate CycleOps from Powertap devices (both  have manufacturer 9)
    if (m.manufacturerId === SARIS_MANUFACTURER_ID) {
      if (_.contains(POWERTAP_MODELS, modelIdString)) {
        type = POWER_METER_DEVICE;
      }
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
