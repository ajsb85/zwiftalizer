var _ = require('underscore')
import toArray from './toArray'

const MAX_BATTERY_LEVEL = 4

const batteryLevelRegex = /^\[[^\]]*\]\s+ant\s+:\s+did\s+[\d]*\s+battery\s+level\s.*$/i

// lines is assumed to be ANT lines only, as an array, with times already in unix format using epochify
export default function mapAntBatteryLevels(lines, device) {

  const antLines = Array.isArray(lines) ? lines : toArray(lines)

  const batteryLevelLines = []

  let batteryLevels = []

  _.each(antLines, line => {
    batteryLevelRegex.test(line) && batteryLevelLines.push(line)
  })

  if (!batteryLevelLines.length) {
    return batteryLevels
  }

  _.each(batteryLevelLines, batteryLevelLine => {

    const matches = batteryLevelLine.match(/^\[[^\]]*\]\s+ant\s+:\s+did\s+([\d]*)\s+battery\s+level\s([\d]*).*$/i)

    if (!matches) {
      return undefined
    }

    const extendedDeviceId = matches[1]

    let deviceId = 0

    try {
      // get lower 16 bits of the 20 bit number
      // if the device id is not extended, then deviceId will be the same as extendedDeviceId
      // we need this as a string for merging into the device object by matching on ids
      deviceId = parseInt(extendedDeviceId) & 0xFFFF
    } catch (e) {
      console.log('Failed to extract short deviceId from extended deviceId in getting battery levels')
      return undefined;
    }

    let batteryLevel = 0

    try {
      batteryLevel = parseInt(matches[2])
    } catch (e) {
      console.log('Failed to convert battery level to integer')
      return undefined;
    }

    batteryLevels = batteryLevels.concat([{
      deviceId,
      batteryLevel: Math.min(batteryLevel, MAX_BATTERY_LEVEL)
    }])

  })

  // gets the min value for each distinct extendedDeviceId
  const reduced = _.chain(batteryLevels)
    .groupBy('deviceId')
    .map((obj, key) => {
      var minLevel = _.chain(obj).pluck('batteryLevel').min().value()
      return {
        deviceId: parseInt(key),
        batteryLevel: minLevel
      }
    })
    .value()

  return reduced
}
