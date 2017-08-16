/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as Parser from '../parser/index';

import {
  TOGGLE_PROFILE_PANEL,
  SET_CURRENT_SYSTEM_BENCHMARK
} from './benchmarks';

import { POWER_METER_DEVICE, SMART_TRAINER_DEVICE } from '../parser/constants';

const request = require('qwest');

const _ = require('underscore');

const moment = require('moment');

const uuid = require('node-uuid');

const delay = 200;

export const SET_SYSTEM_DATA = 'SET_SYSTEM_DATA';
export const SET_ACTIVITY_DATA = 'SET_ACTIVITY_DATA';
export const SET_GRAPHICS_DATA = 'SET_GRAPHICS_DATA';
export const SET_ANT_DATA = 'SET_ANT_DATA';
export const SET_ANT_DEVICES = 'SET_ANT_DEVICES';
export const SET_NETWORK_DATA = 'SET_NETWORK_DATA';
export const SET_BTLE_DATA = 'SET_BTLE_DATA';
export const FILE_LOADED = 'FILE_LOADED';
export const UNABLE_TO_LOAD_FILE = 'UNABLE_TO_LOAD_FILE';
export const FILE_LOADING = 'FILE_LOADING';
export const RESET = 'RESET';
export const SHOW_UNKNOWN_POWERMETER_MODEL_MODAL = 'SHOW_UNKNOWN_POWERMETER_MODEL_MODAL';
export const SHOW_UNKNOWN_SMART_TRAINER_MODEL_MODAL = 'SHOW_UNKNOWN_SMART_TRAINER_MODEL_MODAL';

function fileLoading() {
  return {
    type: FILE_LOADING
  };
}

function fileLoaded() {
  return {
    type: FILE_LOADED
  };
}

function unableToLoadFile() {
  return {
    type: UNABLE_TO_LOAD_FILE
  };
}

export function reset() {
  return {
    type: RESET
  };
}

export function closeUnknownPowerMeterModelModal() {
  return dispatch => {
    dispatch({
      type: SHOW_UNKNOWN_POWERMETER_MODEL_MODAL,
      data: false
    });
  };
}

export function closeUnknownSmartTrainerModelModal() {
  return dispatch => {
    dispatch({
      type: SHOW_UNKNOWN_SMART_TRAINER_MODEL_MODAL,
      data: false
    });
  };
}

function parseActivity(log) {
  const startDate = Parser.startDate(log);
  const startTime = Parser.startTime(log);
  const startDateTime = Parser.startDateTime(log);
  const duration = Parser.duration(log);
  const durationFormatted = Parser.toHoursMinutesSeconds(duration);
  const humanizedDuration = Parser.humanizeDuration(durationFormatted);
  const startTimestamp = moment(startDateTime, 'HH:mm:ss YYYY-MM-DD').unix();
  const timerange = Parser.timerange(startTimestamp, duration);
  const endTimestamp = timerange.endMilliseconds / 1000;
  const timeAxisTimeSeries = Parser.timeAxis(
    timerange.startMilliseconds,
    timerange.endMilliseconds
  );

  // console.log(`activity duration in seconds: ${duration}`);

  // using Object.freeze to ensure these properties cannot accidentally be modified
  return Object.freeze({
    startDate,
    startTime,
    startDateTime,
    startTimestamp,
    endTimestamp,
    duration,
    durationFormatted,
    humanizedDuration,
    timeAxisTimeSeries
  });
}

function parseGraphics(log, duration = 0) {
  // default sampleSize is 15 second average buckets
  let sampleSize = 15;

  // if greater than 2 hours, increase the sampleSize to 30 second average buckets
  if (duration > 2 * 60 * 60) {
    sampleSize = 30;
  }

  // if greater than 4 hours, increase the sampleSize to 60 second average buckets
  if (duration > 4 * 60 * 60) {
    sampleSize = 60;
  }

  sampleSize += 's';

  const fpsLines = Parser.mapFpsLines(log);

  const fpsSamples = (fpsLines && fpsLines.length) || 0;

  const fpsData = Parser.reduceFps(fpsLines, sampleSize);

  return {
    fpsSamples,
    fpsData
  };
}

function parseAnt(log, timeAxisTimeSeries) {
  const antData = Parser.antData(log, timeAxisTimeSeries);
  return antData;
}

function parseNetwork(log, timeAxisTimeSeries) {
  const networkLines = Parser.mapNetworkLines(log);

  const reconnects = Parser.mapNetworkReconnects(
    networkLines,
    timeAxisTimeSeries
  );

  const errors = Parser.mapNetworkErrors(networkLines, timeAxisTimeSeries);

  return {
    reconnects,
    errors
  };
}

function parseBtle(log, timeAxisTimeSeries) {
  const btleLines = Parser.mapBTLELines(log);

  const messages = Parser.mapBTLEMessages(btleLines, timeAxisTimeSeries);

  return {
    messages
  };
}

function parseHead(head) {
  // platform detection depends on line endings,
  // so do it before cleaning the line endings
  const platform = Parser.platform(head);

  const normalizedHead = Parser.normalize(head);

  const cpuVendor = Parser.cpuVendor(normalizedHead);

  const cpuDetails = Parser.cpuDetails(normalizedHead);

  const ram = Parser.ram(normalizedHead);

  const gpuVendor = Parser.gpuVendor(normalizedHead);

  const gpuDetails = Parser.gpuDetails(normalizedHead);

  const profile = Parser.profile(normalizedHead);

  const resolution = Parser.resolution(normalizedHead);

  const shadowres = Parser.shadowres(normalizedHead);

  const openglMajor = Parser.openglMajor(normalizedHead);

  const openglMinor = Parser.openglMinor(normalizedHead);

  const gameVersion = Parser.gameVersion(normalizedHead);

  return Object.freeze({
    platform,
    cpuVendor,
    cpuDetails,
    ram,
    gpuVendor,
    gpuDetails,
    profile,
    resolution,
    shadowres,
    openglMajor,
    openglMinor,
    gameVersion
  });
}

export function uploadSytemSummary(data) {
  return function(dispatch) {
    return request
      .post(
        'https://iayslzt1s8.execute-api.us-west-2.amazonaws.com/dev/logs',
        data,
        {
          cache: false,
          dataType: 'json'
        }
      )
      .then((xhr, json) => {
        // console.log('Success uploading system summary')
        // console.log(xhr)
        // console.log(json)
      })
      .catch((e, xhr, response) => {
        console.log('Error uploading system summary');
        console.log(e);
        console.log(xhr);
        console.log(response);
      });
  };
}

export function uploadDevicesSummary(data) {
  return function(dispatch) {
    return request
      .post(
        'https://zkt5wkylqf.execute-api.us-west-2.amazonaws.com/dev/devices',
        data,
        {
          cache: false,
          dataType: 'json'
        }
      )
      .then((xhr, json) => {
        // console.log('Success uploading deviecs summary')
        // console.log(xhr)
        // console.log(json)
      })
      .catch((e, xhr, response) => {
        console.log('Error uploading deviecs summary');
        console.log(e);
        console.log(xhr);
        console.log(response);
      });
  };
}

export function postAntDevice(device) {
  // submit the powermeter device details
  // to the API gateway which will trigger a lambda
  // to email the details to the maintainer of the zwiftalizer-antplus-devices module

  // extract a sub set of the device properties for posting to the API
  const deviceSummary = ((
    {
      type,
      typeName,
      deviceId,
      extendedDeviceId,
      manufacturerId,
      manufacturer,
      modelId,
      model
    }
  ) => {
    return {
      type,
      typeName,
      deviceId,
      extendedDeviceId,
      manufacturerId,
      manufacturer,
      modelId,
      model
    };
  })(device);

  return function(dispatch) {
    return request
      .post(
        'https://5jhhymcz61.execute-api.us-west-2.amazonaws.com/dev/send',
        deviceSummary,
        {
          cache: false,
          dataType: 'json'
        }
      )
      .then((xhr, json) => {
        console.log('Success uploading ant+ device');
        console.log(xhr);
        console.log(json);
      })
      .catch((e, xhr, response) => {
        console.log('Error uploading ant+ device');
        console.log(e);
        console.log(xhr);
        console.log(response);
      });
  };
}

export function setAntDevices(devices) {
  return dispatch => {
    dispatch({
      type: SET_ANT_DEVICES,
      data: devices
    });
  };
}

function parseFileContents(log, isDemo = false, share = true) {
  return dispatch => {
    // this is only to update the ui
    // to let the user know the file is being read
    // (hide the dropzone)
    dispatch(fileLoading());

    // delayed so that the state can update the loading message
    setTimeout(
      () => {
        let systemData;

        try {
          const head = Parser.head(log);
          // we parse the head of the log to get all of the system properties, and the constants for the graphics properties
          systemData = parseHead(head);
        } catch (err) {
          console.log(`Failed to read log: ${err}`);
          dispatch(unableToLoadFile());
        }

        // turn all times into continuous epoch unix timestamps, and normalize all the new lines
        // this is by far the most time consuming loop, so it is split into batches, and a callback function
        // fires when all the timestamps have been converted
        Parser.epochify(Parser.normalize(log), (err, normalizedLog) => {
          try {            
            if (err) {
              console.log(err);
              // @todo, a friendly error message
              dispatch(fileLoaded());
              return;
            }

            const activityData = parseActivity(normalizedLog);

            const graphicsData = parseGraphics(
              normalizedLog,
              activityData.duration
            );

            // now remove all the fps lines to make the next extraction quicker
            const logWithoutFpsLines = Parser.stripFpsLines(normalizedLog);

            const antData = parseAnt(
              logWithoutFpsLines,
              activityData.timeAxisTimeSeries
            );

            // now remove all the ANT+ lines to make the next extraction quicker
            const logWithoutFpsAntLines = Parser.normalize(
              Parser.stripAntLines(logWithoutFpsLines)
            );

            const networkData = parseNetwork(
              logWithoutFpsAntLines,
              activityData.timeAxisTimeSeries
            );

            const btleMessages = parseBtle(
              logWithoutFpsAntLines,
              activityData.timeAxisTimeSeries
            );

            dispatch({
              type: SET_SYSTEM_DATA,
              data: {
                ...systemData
              }
            });

            dispatch({
              type: SET_ACTIVITY_DATA,
              data: {
                ...activityData,
                gameVersion: `${systemData.gameVersion}`
              }
            });

            // notice how we merge the graphics and system data together here,
            // the data.systemData spread operator will include CPU details too
            dispatch({
              type: SET_GRAPHICS_DATA,
              data: {
                ...graphicsData,
                specs: {
                  ...systemData
                }
              }
            });

            const profileName = systemData.profile
              ? systemData.profile.toLowerCase()
              : '';

            let profileId = 0;

            switch (profileName) {
              case 'ultra':
                profileId = 3;
                break;

              case 'high':
                profileId = 2;
                break;

              case 'medium':
                profileId = 1;
                break;

              default:
                profileId = 0;
                break;
            }

            dispatch({
              type: SET_ANT_DATA,
              data: {
                ...antData
              }
            });

            dispatch({
              type: SET_NETWORK_DATA,
              data: {
                ...networkData
              }
            });

            dispatch({
              type: SET_BTLE_DATA,
              data: {
                ...btleMessages
              }
            });

            if (graphicsData.fpsData.count) {
              const systemSummary = {
                logId: uuid.v4(),
                timestamp: activityData.startTimestamp,
                duration: `${activityData.duration}`,
                gameVersion: `${systemData.gameVersion}`,
                specs: {
                  resolution: systemData.resolution,
                  profileId: `${profileId}`,
                  profile: systemData.profile,
                  minFps: `${Math.round(graphicsData.fpsData.min())}`,
                  maxFps: `${Math.round(graphicsData.fpsData.max())}`,
                  avgFps: `${Math.round(graphicsData.fpsData.avg())}`,
                  stdev: `${Math.round(graphicsData.fpsData.stdev())}`,
                  samples: `${graphicsData.fpsSamples}`,
                  platform: systemData.platform,
                  cpuVendor: systemData.cpuVendor,
                  cpuDetails: systemData.cpuDetails,
                  ram: systemData.ram,
                  gpuVendor: systemData.gpuVendor,
                  gpuDetails: systemData.gpuDetails,
                  shadowres: systemData.shadowres,
                  openglMajor: systemData.openglMajor,
                  gameVersion: systemData.gameVersion
                }
              };

              const systemId = `${systemData.platform} / ${systemData.cpuVendor} ${systemData.cpuDetails} / ${systemData.gpuVendor} ${systemData.gpuDetails}`;

              const panelKey = `${systemData.resolution}-${profileId}`;

              const currentSystemBenchmark = {
                resolution: parseInt(systemData.resolution, 10),
                profileId: parseInt(profileId, 10),
                panelKey,
                specs: Object.assign({}, systemSummary.specs, {
                  systemId
                })
              };

              dispatch({
                type: SET_CURRENT_SYSTEM_BENCHMARK,
                data: {
                  ...currentSystemBenchmark
                }
              });

              // this dispatch is to write which benchmarks panel to expanded
              // based on the current system
              // using local storage to persist this state
              // of which panels are toggled
              dispatch({
                type: TOGGLE_PROFILE_PANEL,
                data: {
                  key: panelKey
                }
              });

              if (!isDemo && share) {
                dispatch(uploadSytemSummary(systemSummary));
              }
            }

            if (!isDemo && share && antData.devices) {
              // extract just the power meter and smart trainer type devicesSummary
              const powerSourceDevices = _.filter(antData.devices, d => {
                return d.type === SMART_TRAINER_DEVICE ||
                  d.type === POWER_METER_DEVICE;
              });

              if (powerSourceDevices && powerSourceDevices.length) {
                const devicesSummaryData = [];

                _.each(powerSourceDevices, d => {
                  // extract a sub set of the device properties for posting to the central db
                  const deviceSummary = ((
                    {
                      extendedDeviceId,
                      manufacturerId,
                      manufacturer,
                      modelId,
                      model,
                      type
                    }
                  ) => {
                    return {
                      extendedDeviceId,
                      manufacturerId,
                      manufacturer,
                      modelId,
                      model,
                      type
                    };
                  })(d);

                  // @todo, check for empty values, particularly in modelId and model name

                  devicesSummaryData.push(deviceSummary);
                });

                // console.log('devices summary data for api post');
                // console.log(JSON.stringify(devicesSummaryData));

                dispatch(uploadDevicesSummary({ devices: devicesSummaryData }));
              }
            }
            dispatch(fileLoaded());
          } catch (err2) {
            console.log(`Failed to read log: ${err2}`);
            dispatch(unableToLoadFile());
          }
        });
      },
      delay
    );
  };
}

export function loadDemo() {
  return dispatch => {
    request
      .get('demolog.txt', null, {
        cache: true,
        dataType: 'json'
      })
      .then((xhr, response) => {
        dispatch(parseFileContents(response, true, false));
      });
  };
}

export function readFile(log, share = true) {
  return dispatch => {
    const reader = new FileReader();

    reader.onload = () => {
      dispatch(parseFileContents(reader.result, false, share));
    };

    reader.readAsText(log);
  };
}
