var _ = require('underscore');

import toArray from './toArray';
import titleCase from './titleCase';
import manufacturersLookup from '../types/antCyclingManufacturers.json';

import tacxDevices from '../types/tacx.json';
import wahooDevices from '../types/wahoo.json';
import bkoolDevices from '../types/bkool.json';
import sarisDevices from '../types/saris.json';
import eliteDevices from '../types/elite.json';
import fourEyesDevices from '../types/fourEyes.json';
import garminDevices from '../types/garmin.json';
import stagesDevices from '../types/stages.json';
import saxonarDevices from '../types/saxonar.json';

import deviceTypes from '../types/devices.json';

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
  SARIS_HAMMER_MODEL_ID
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

  _.some(mfgLines, m => {
    const matches = m.match(
      /^\[[^\]]*\]\s+?ant\s+?:\s+?did\s+?([\d]*)\s+?mfg\s+?([\d]*)\s+?model\s+?([\d]*)$/i
    );

    if (!matches) {
      console.log(
        'Failed to extract extendedDeviceId, manufacturer, model from manufacturer line'
      );
      return;
    }

    // extendedDeviceId and manufacturerId must be numbers else they would not have passed the regex test
    const extendedDeviceId = matches[1];
    const manufacturerId = matches[2];
    const modelId = matches[3];

    // yes, allow model to be 0
    if (!extendedDeviceId || !manufacturerId) {
      console.log(
        'Failed to get values for ant extendedDeviceId, manufacturer'
      );
      return;
    }

    // saris/cycleops powertap pro+ wireless blurts out all kinds of manufacturer id junk
    // ignore manufacturerIds that a are out of the range of the lookup table
    if (parseInt(manufacturerId) > MAX_MANUFACTURER_ID) {
      return;
    }

    let type = BASIC_DEVICE;

    // treat kickr as FEC smart trainer, until we know whether or not it is doing its own gradient protocol or FEC standard

    if (_.contains(SMART_TRAINER_MANUFACTURERS, manufacturerId)) {
      // set to SMART_TRAINER_DEVICE (smart trainer), but still could be a Saris power meter
      // we will switch on SARIS later
      type = SMART_TRAINER_DEVICE;
    } else if (_.contains(POWERMETER_MANUFACTURERS, manufacturerId)) {
      type = POWER_METER_DEVICE;
    }

    // could still be an old powertap that doesn't broadcast manufacturer properly
    // in which case, type will still be BASIC_DEVICE
    let deviceId = 0;

    try {
      // get lower 16 bits of the 20 bit number
      deviceId = parseInt(extendedDeviceId) & 0xffff;
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId');
    }

    // get manufacturer name and model (for ones we have lookups on)
    let manufacturer = '';

    if (_(manufacturersLookup).has(manufacturerId)) {
      manufacturer = titleCase(manufacturersLookup[manufacturerId]);
    }

    let model = '';

    if (modelId) {
      const manufacturerIdSting = '' + manufacturerId;

      // @todo, refactor to use the same data source as the reporting lambdas

      // try and get model strings for the manufacturers that do this type of thing
      switch (manufacturerIdSting) {
        case WAHOO_MANUFACTURER_ID:
          if (_(wahooDevices).has(modelId)) {
            model = titleCase(wahooDevices[modelId]);
          }
          break;

        case TACX_MANUFACTURER_ID:
          if (_(tacxDevices).has(modelId)) {
            model = titleCase(tacxDevices[modelId]);
          }
          break;

        case BKOOL_MANUFACTURER_ID:
          if (_(bkoolDevices).has(modelId)) {
            model = titleCase(bkoolDevices[modelId]);
          }
          break;

        case STAGES_MANUFACTURER_ID:
          if (_(stagesDevices).has(modelId)) {
            model = titleCase(stagesDevices[modelId]);
          }
          break;

        case FOUREYES_MANUFACTURER_ID:
          if (_(fourEyesDevices).has(modelId)) {
            model = titleCase(fourEyesDevices[modelId]);
          }
          break;

        case GARMIN_MANUFACTURER_ID:
          if (_(garminDevices).has(modelId)) {
            model = titleCase(garminDevices[modelId]);
          }
          break;

        case SAXONAR_MANUFACTURER_ID:
          if (_(saxonarDevices).has(modelId)) {
            model = titleCase(saxonarDevices[modelId]);
          }
          break;

        case SARIS_MANUFACTURER_ID:
          if (_(sarisDevices).has(modelId)) {
            model = titleCase(sarisDevices[modelId]);
          }

          if (modelId === SARIS_HAMMER_MODEL_ID) {
            // @todo, or MAGNUS, POWERBEAM, POWERSYNC
            type = SMART_TRAINER_DEVICE;
          }

          break;

        case ELITE_MANUFACTURER_ID:
          if (_(eliteDevices).has(modelId)) {
            model = titleCase(eliteDevices[modelId]);
          }
          break;

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
    };

    entry.typeName = titleCase(deviceTypes[type]);

    if (entry.model === '') {
      entry.model = 'Unknown';
    }

    if (!_.findWhere(manufacturerModelItems, entry)) {
      manufacturerModelItems.push(entry);
    }

    // _.some(array, f(x)) breaks if f(x) returns true
    // this is the predeciate that says 'we have some' devices
    if (manufacturerModelItems.length === MAX_DEVICES) {
      return true;
    }
  });

  return manufacturerModelItems;
}
