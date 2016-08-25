/**
 * Turns a string into an array of string splitting on `\n` then returns the length of the array
 * returns 0 if the str is not of type string
 * @param {string} str - The string
 */
export default function lineCount(str) {

  if (!str) {
    return 0
  }

  if (typeof str !== 'string') {
    return 0
  }

  return (str.trim().split('\n')).length;
}