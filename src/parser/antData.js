var _ = require('underscore');
const AntplusDevices = require('zwiftalizer-antplus-devices');

import {
  WAHOO_MANUFACTURER_ID,
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  SARIS_MANUFACTURER_ID
} from './constants';

import titleCase from './titleCase';
import mapAntLines from './mapAntLines';
import antDevices from './antDevices';
import antManufacturers from './antManufacturers';
import mapAntSearches from './mapAntSearches';
import mapAntRxFails from './mapAntRxFails';
import mapPowermeterData from './mapPowermeterData';
import mapGradientData from './mapGradientData';
import mapCalibrationData from './mapCalibrationData';
import deviceTypes from '../types/devices.json';

import { TimeSeries } from 'pondjs';

const BASIC_DEVICE_SAMPLE_RATE = 4;

export default function antData(log, timeAxisTimeSeries) {
  const antLines = mapAntLines(log);

  const devices = antDevices(antLines);

  const manufacturerModelItems = antManufacturers(antLines);

  const searches = mapAntSearches(antLines, timeAxisTimeSeries);

  const power = mapPowermeterData(antLines, timeAxisTimeSeries);

  const calibration = mapCalibrationData(antLines);

  // get failures for each device, and map in the manufacturer, if known
  _.each(devices, device => {
    const manufacturer = _.find(manufacturerModelItems, m => {
      return m.deviceId === device.deviceId;
    });

    // this is where device type gets set
    if (manufacturer) {
      Object.assign(device, manufacturer);
    }

    // always get rxfails for the channel because it can reveal
    // if a device is being sampled at a high rate (probably a power source)
    const signal = mapAntRxFails(antLines, device, timeAxisTimeSeries);

    // attempt to find powermeters that do not broadcast manufacturer and modelIds (pro+, sl+, PowerBeam, PowerSync, Phantom 5, Phantom 3)
    // rxfail pattern does not look like a basic device,
    // is not already detected as being made by a known PM manufacturer (could be saris, powertap)
    // and is not a SMART_TRAINER_DEVICE, or KICKR

    

    //@todo, check we are not attributing a kickr ANT+ powermeter to cycleops, shoudn't be as 
    // device.manufacturerId should be set for Wahoo Kickr
    
    if (
      // if we have power data, and the device appears to be sampled at 
      // a rate highe than the basic sample rate
      // and the device has neither been identified as a 
      // smart trainer or power meter, 
      // and we have no manufacturerId then it's very likely to be a power tap
      power.count() && signal.max() > BASIC_DEVICE_SAMPLE_RATE &&
      device.type === BASIC_DEVICE &&
      device.manufacturerId === ''
    ) {
      device.type = POWER_METER_DEVICE;
      device.typeName = titleCase(deviceTypes[POWER_METER_DEVICE]);
      // out of all the known power meters, saris/powertap/cycleops is the only one we know of that
      // does not broadcast manufacturerId, modelId. Going to take a big risk here and attribute the
      // power data source to cycleops
      device.manufacturerId = SARIS_MANUFACTURER_ID;
      device.modelId = 0; /* generic */
      device.manufacturer = 'PowerTap';
      device.model = 'Wireless';
    }

    Object.assign(device, {
      signal
    });
  });

  const powerDevice = _.find(devices, device => {
    return device.type === POWER_METER_DEVICE;
  });

  const kickrDevice = _.find(devices, device => {
    return device.type === SMART_TRAINER_DEVICE &&
      device.manufacturerId === WAHOO_MANUFACTURER_ID;
  });

  // can be kickr again, in fec mode, not ANT+ power meter data mode
  const fecSmartTrainerDevice = _.find(devices, device => {
    return device.type === SMART_TRAINER_DEVICE;
  });

  // assign the power data to the powermeter before the kickr, but never both
  // Does not work for Paul Holmgren who uses a stages PM as a cadence meter and kickr for power because of ERG mode
  // Would be interesting to see if we can detect ERG mode is engaged
  if (powerDevice) {
    Object.assign(powerDevice, {
      power,
      calibration
    });
  } else if (kickrDevice) {
    // kickr does not emit calibration zero offset
    Object.assign(kickrDevice, {
      power
    });
  }

  // if power was assigned to powermeter device, then kickrDevice.power will be undefined
  // assign a null power timeseries to kickr
  if (kickrDevice && !kickrDevice.power) {
    const power = new TimeSeries({
      name: 'power',
      columns: ['time', 'value'],
      points: []
    });

    const reducedPowerSeries = TimeSeries.timeSeriesListSum({
      name: 'power',
      fieldSpec: ['time', 'value'],
      seriesList: [timeAxisTimeSeries, power]
    });

    Object.assign(kickrDevice, {
      power: reducedPowerSeries
    });
  }

  if (fecSmartTrainerDevice) {
    const gradient = mapGradientData(antLines, timeAxisTimeSeries);
    Object.assign(fecSmartTrainerDevice, {
      gradient
    });
  }

  // showUnknownPowermeterModelModal is the state variable used to trigger
  // opening a modal windows to prompt the user to supply
  // the name of the power meter model.
  let showUnknownPowermeterModelModal = false;

  if (powerDevice && powerDevice.manufacturerId !== 0 && powerDevice.model === 'Unknown'){
    showUnknownPowermeterModelModal = true;
  }

  return Object.freeze({
    devices,
    searches,
    showUnknownPowermeterModelModal
  });
}
