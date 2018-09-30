import toArray from './toArray';

import titleCase from './titleCase';

import deviceTypes from '../types/devices.json';

import {
  MAX_MANUFACTURER_ID,
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

const AntplusDevices = require('../../local_modules/node_modules/zwiftalizer-antplus-devices');

const _ = require('underscore');

/**
 * Returns an array of ant+ device manufacturers
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
    if (antManufacturersRegex.test(line)) {
      mfgLines.push(line);
    }
  });

  if (!mfgLines.length) {
    console.log('no ant manufacturer lines found');
    return manufacturerModelItems;
  }

  const distinctMfgModelEntries = [];

  const j = mfgLines.length;

  for (let i = 0; i < j; i += 1) {
    const m = mfgLines[i];

    const matches = m.match(
      /^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg\s+?([\d]*)\s+?model\s+?([\d]*)$/i
    );

    if (matches) {
      const extendedDeviceId = parseInt(matches[1], 10);
      const manufacturerId = parseInt(matches[2], 10);

      let modelId = parseInt(matches[3], 10);

      // saris/cycleops powertap pro+ wireless blurts out all kinds of manufacturer id junk
      // ignore manufacturerIds that a are out of the range of the lookup table

      if (
        extendedDeviceId &&
        manufacturerId &&
        manufacturerId < MAX_MANUFACTURER_ID
      ) {
        // The special case of the Tacx Neo, says it's Model 1 and Model 2800, take Model 2800
        // Be sure to check we are not couting model 2800 twice because of this conversion.

        // 2017-05-22, bug, manufacturerId is int but TACX_MANUFACTURER_ID is string. Comparison fails.
        if (`${manufacturerId}` === TACX_MANUFACTURER_ID && modelId === 1) {
          modelId = 2800;
        }

        // 2017-05-25, possible bug, Elite Drivo might be model 0 or model 20.
        // We might have to group them together as model 0, like we are doing for Neos that have two
        // possible model numbers.
        // if (manufacturerIdString === ELITE_MANUFACTURER_ID && modelId === 20) {
        //   modelId = 0;
        // }

        const entry = {
          extendedDeviceId,
          manufacturerId,
          modelId
        };

        // @todo, it might be a bit quicker to always push devices
        // onto the array, then call uniq to get the distinct list
        if (!_.findWhere(distinctMfgModelEntries, entry)) {
          distinctMfgModelEntries.push(entry);
        }
      }
    }
  }

  _.each(distinctMfgModelEntries, m => {
    const entry = {
      extendedDeviceId: m.extendedDeviceId,
      deviceId: 0,
      manufacturerId: `${m.manufacturerId}`,
      manufacturer: 'Unknown',
      modelId: `${m.modelId}`,
      model: 'Unknown',
      type: BASIC_DEVICE
    };

    // treat kickr as FEC smart trainer, until we know whether or not it is doing its own gradient protocol or FEC standard
    if (_.contains(SMART_TRAINER_MANUFACTURERS, entry.manufacturerId)) {
      // set to SMART_TRAINER_DEVICE (smart trainer), but still could be a Saris power meter
      entry.type = SMART_TRAINER_DEVICE;
    } else if (_.contains(POWERMETER_MANUFACTURERS, entry.manufacturerId)) {
      entry.type = POWER_METER_DEVICE;
    }

    try {
      // Get lower 16 bits of the 20 bit number.
      // This is critical for matching up channels with devices when we look at rxfails.
      entry.deviceId = parseInt(entry.extendedDeviceId, 10) & 0xffff;
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId');
    }

    // try and differentiate between CycleOps and Powertap devices (both have manufacturer 9)
    if (`${entry.manufacturerId}` === SARIS_MANUFACTURER_ID) {
      if (_.contains(POWERTAP_MODELS, entry.modelId)) {
        entry.type = POWER_METER_DEVICE;
      } else if (_.contains(CYCLEOPS_TRAINER_MODELS, entry.modelId)) {
        entry.type = SMART_TRAINER_DEVICE;
      } else {
        // Generic powertap device
        entry.type = POWER_METER_DEVICE;
        entry.modelId = 0;
      }
    }

    // PowerBeat
    if (entry.manufacturerId === WATTTEAM_MANUFACTURER_ID) {
      entry.type = POWER_METER_DEVICE;
      entry.modelId = 0;
    }

    // wattbike
    if (entry.manufacturerId === WATTBIKE_MANUFACTURER_ID) {
      entry.type = SMART_TRAINER_DEVICE;
      entry.modelId = 0;
    }

    // Always use strings for AntplusDevice lookup.
    // 2017-05-25, this should fix the bug
    // where Wattbike trigges the unknown device modal, when it should not.
    // returns undefined if manufacturer not found
    const makeAndModel = AntplusDevices.find(
      entry.manufacturerId,
      entry.modelId,
      entry.type
    );

    if (typeof makeAndModel !== 'undefined') {
      entry.manufacturer =
        makeAndModel.manufacturerName !== 'Unknown'
          ? makeAndModel.manufacturerName
          : '';
      entry.model =
        makeAndModel.modelName !== 'Unknown' ? makeAndModel.modelName : '';
    }

    entry.typeName = titleCase(deviceTypes[entry.type]);

    manufacturerModelItems.push(entry);
  });

  return manufacturerModelItems;
}
