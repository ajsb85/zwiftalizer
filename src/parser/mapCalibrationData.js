var _ = require('underscore')

/**
 * Returns the last seen calibration lastCalibration
 * @param {string} str - The string
 */

import toArray from './toArray'

export const LITTLE_ENDIAN = 1
export const BIG_ENDIAN = 0

const calibrationLineRegex = /^\[[^\]]*\]\s+calibration\s+?data\s+.*$/i;

const doubleByteToUint16 = function(bytes, endianness = LITTLE_ENDIAN) {

  // Quark is bigendian (and maybe SRM) (most significant byte comes first)
  if (endianness === BIG_ENDIAN) {
    return (parseInt(bytes[0]) << 8) + parseInt(bytes[1])
  }

  // else
  // ANT+ standard, littleendian (least significant byte comes first)
  return parseInt(bytes[0]) + (parseInt(bytes[1]) << 8)
}

export default function mapCalibrationData(lines) {

  if (!lines) {
    return undefined
  }

  const antLines = Array.isArray(lines) ? lines : toArray(lines)

  const calibrations = []

  _.each(antLines, line => {
    calibrationLineRegex.test(line) && calibrations.push(line)
  })

  if (!calibrations.length) {
    return undefined
  }

  // take last calibration line
  let lastCalibration = calibrations[calibrations.length - 1]

  const captures = lastCalibration.match(/^\[[^\]]*\]\s+?calibration\s+?data\s+?((?:\[\d{1,3}\]\s?)+)$/i)

  if (!captures) {
    return undefined
  }

  let bytes

  try {

    bytes = captures[1].replace(/[\[|\]]/g, '').split(' ')

    let status = undefined

    let endiannessGuess = LITTLE_ENDIAN

    let autoZero = false;

    const calibrationID = parseInt(bytes.slice(1, 2))

    switch (calibrationID) {

      // SRM,
      case 1:
        // Quarq
      case 18:
        status = true
        endiannessGuess = BIG_ENDIAN
        break;
        // ANT+ standard (saris, stages)
      case 172:
        status = true
        break

      case 175:
        status = false
        break
    }

    const autoZerostatusByte = parseInt(bytes.slice(2, 3))

    switch (autoZerostatusByte) {

      case 0:
        autoZero = true;
        break

      case 1:
        autoZero = false;
        break
    }

    // The last two bytes are the powermeter's zero offset value.
    // This is a signed two-byte number allowing for values ranging from -32768 to +32767
    // Endian-ness matters :-(
    const zeroOffsetBytes = bytes.slice(6, 8)

    // D00001086_-_ANT+_Device_Profile_-_Bicycle_Power_-_Rev4.2.pdf
    // Page 53

    // Table 13-5. General Calibration Response Message Format
    // Byte,   Description,   Length,  Value,  Units
    // 0,  Data Page Number 1 Byte,   0x01 (Calibration Message)
    // 1,  Calibration ID, 1 Byte,    0xAC (172) (Calibration Response Successful),
    //                                0xAF (175) (Calibration Response Failed)
    // see https://github.com/GoldenCheetah/GoldenCheetah/blob/master/src/ANT/ANTMessage.cpp
    // for SRM, proprietary, non standard ANT+ value here
    //                                0x01 (1) (SRM, zero offset, read last 2 bytes as big endian)
    //                                0x02 (2) (SRM, slope)
    //                                0x03 (3) (SRM, serial number)
    // Quarq is also proprietary, non standard ANT+ value here too
    //                                0x12 (18) (Quarq, zero offset, read last 2 bytes as big endian)
    // 2, Auto Zero status, 1 Byte,
    //                                0x00 (0) – Auto Zero Is OFF
    //                                0x01 (1) – Auto Zero Is ON
    //                                0xFF (255) – Auto Zero Is Not Supported
    // 3, Reserved \
    // 4, Reserved  -- 3 Bytes Set to 0xFFFFFF N/A
    // 5, Reserved /
    // 6+7, Calibration Data LSB+MSB, 2 Bytes, This is a signed two-byte number allowing for
    // values ranging from -32768 to +32767

    // don't trust value of zero, or max value 

    if (parseInt(zeroOffsetBytes[0]) === 0 && parseInt(zeroOffsetBytes[1]) === 0) {
      return undefined
    }

    if (parseInt(zeroOffsetBytes[0]) === 255 && parseInt(zeroOffsetBytes[1]) === 255) {
      return undefined
    }

    const valueBigEndian = doubleByteToUint16(zeroOffsetBytes, BIG_ENDIAN)

    const valueLittleEndian = doubleByteToUint16(zeroOffsetBytes, LITTLE_ENDIAN)

    const primaryValue = endiannessGuess === BIG_ENDIAN ? valueBigEndian : valueLittleEndian

    const secondaryValue = endiannessGuess === BIG_ENDIAN ? valueLittleEndian : valueBigEndian

    return {
      status,
      autoZero,
      values: [
        primaryValue,
        secondaryValue
      ],
      endiannessGuess
    }

  } catch (e) {
    console.log('Error parsing calibration data: ' + e)
    return undefined
  }
}
