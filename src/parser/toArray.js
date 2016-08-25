/**
 * Turns a string into an array of string splitting on `\n`
 * @param {string} str - The string
 */
export default function toArray(str) {

  if (!str) {
    return str
  }

  //console.log(typeof str)

  if (typeof str !== 'string') {
    return str
  }

  return str.trim().split('\n');
}