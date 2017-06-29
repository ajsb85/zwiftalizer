import { TimeSeries } from 'pondjs';

import titleCase from './titleCase';

import mapAntLines from './mapAntLines';

// get SRM time based power data, not doing anything with this yet
import getTimeBasedPowerData from './getTimeBasedPowerData';

import antDevices from './antDevices';

import antManufacturers from './antManufacturers';

import mapAntSearches from './mapAntSearches';

import mapAntRxFails from './mapAntRxFails';

import mapPowermeterData from './mapPowermeterData';

import mapGradientData from './mapGradientData';

import mapCalibrationData from './mapCalibrationData';

import deviceTypes from '../types/devices.json';

import indexToUnixTime from './indexToUnixTime';

import {
  WAHOO_MANUFACTURER_ID,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  ANT_AVERAGES_WINDOW_IN_SEC
} from './constants';

const _ = require('underscore');

export default function antData(log, timeAxisTimeSeries) {
  const antLines = mapAntLines(log);
  const devices = antDevices(antLines);
  const manufacturerModelItems = antManufacturers(antLines);
  const searches = mapAntSearches(antLines, timeAxisTimeSeries);
  const searchesTimestamps = [];

  // gets the timestamps of goto searches
  // for correlating with the times in each device channel that `might`
  // be low because of re-pairings
  for (const e of searches.collection().events()) {
    // const e = JSON.parse(event);
    if (e.get('value') > 0) {
      searchesTimestamps.push(indexToUnixTime(e.indexAsString()));
    }
  }

  // rounding to nearest ANT_AVERAGES_WINDOW_IN_SEC
  const searchesTimestampsRounded = _.uniq(
    searchesTimestamps.map(t => {
      return `${ANT_AVERAGES_WINDOW_IN_SEC}s-${Math.round(t / ANT_AVERAGES_WINDOW_IN_SEC) * ANT_AVERAGES_WINDOW_IN_SEC}`;
    })
  );

  // gets the power data, but we can not tell which device / channel is producing it
  const power = mapPowermeterData(antLines, timeAxisTimeSeries);

  // gets SRM time based power entries, but we do not try to do anything with the values yet
  // const timeBasedPowerEntries = getTimeBasedPowerData(log);

  // this is kinda useless, just prints info
  const calibration = mapCalibrationData(antLines);

  // get failures for each device, and map in the manufacturer if known
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
    const signal = mapAntRxFails(
      antLines,
      device,
      timeAxisTimeSeries,
      searchesTimestampsRounded
    );

    Object.assign(device, {
      signal: signal.timeseries,
      dropouts: signal.dropouts,
      dropoutsTotal: signal.dropouts.length || 0,
      sampleRate: signal.sampleRate,
      failureRate: signal.failureRate
    });
  });

  const powerDevice = _.find(devices, device => {
    return device.type === POWER_METER_DEVICE;
  });

  const kickrDevice = _.find(devices, device => {
    return device.type === SMART_TRAINER_DEVICE &&
      `${device.manufacturerId}` === WAHOO_MANUFACTURER_ID;
  });

  // can be kickr again, in fec mode, not ANT+ power meter data mode
  const fecSmartTrainerDevice = _.find(devices, device => {
    return device.type === SMART_TRAINER_DEVICE;
  });

  // Assign the power data to the powermeter before the kickr, but never both.
  // Does not work for Paul Holmgren who uses a stages PM as a cadence meter and kickr for power because of ERG mode.
  // Would be interesting to see if we can detect ERG mode is engaged.
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
    const nullPower = new TimeSeries({
      name: 'power',
      columns: ['time', 'value'],
      points: []
    });

    const reducedNullPowerSeries = TimeSeries.timeSeriesListSum({
      name: 'power',
      fieldSpec: ['time', 'value'],
      seriesList: [timeAxisTimeSeries, nullPower]
    });

    Object.assign(kickrDevice, {
      power: reducedNullPowerSeries
    });
  }

  if (fecSmartTrainerDevice) {
    const gradient = mapGradientData(antLines, timeAxisTimeSeries);
    Object.assign(fecSmartTrainerDevice, {
      gradient
    });
  }

  // The state variable used to trigger
  // opening a modal windows to prompt the user to supply
  // the name of the power meter model.
  let showUnknownPowerMeterModelModal = false;

  // The state variable used to trigger
  // opening a modal windows to prompt the user to supply
  // the name of the smart trainer model.
  let showUnknownSmartTrainerModelModal = false;

  if (
    powerDevice && powerDevice.manufacturerId && powerDevice.model === 'Unknown'
  ) {
    showUnknownPowerMeterModelModal = true;
  }

  // for testing the modal
  //showUnknownPowerMeterModelModal = true;

  if (
    fecSmartTrainerDevice &&
    fecSmartTrainerDevice.manufacturerId &&
    fecSmartTrainerDevice.model === 'Unknown'
  ) {
    showUnknownSmartTrainerModelModal = true;
  }

  // for testing the modal
  //showUnknownSmartTrainerModelModal = true;

  return Object.freeze({
    devices,
    searches,
    showUnknownPowerMeterModelModal,
    showUnknownSmartTrainerModelModal,
    searchesTimestampsRounded
  });
}
