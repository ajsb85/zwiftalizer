/**
 * Returns the timeOfDay with a leading zero in the hour part
 * if the hour is less than or equal to 9
 * @param {string} timeOfDay - The log timeOfDay as a string
 */
export default function zeroPad(timeOfDay) {

  let result = timeOfDay

  let hour = result.replace(/^(\d*):\d*:\d*$/, '$1')

  // hour will get cast to int in comparison function
  if (hour <= 9) {
    result = '0' + result
  }

  return result
}