/**
 * Replaces all combinations of carriage return and newline with single newline,
 * and removes all blank lines
 * Returns the first N chars of the string, or the whole string if length < N
 * @param {string} str - The string
 */
export default function normalize(str) {
  return str.replace(/[\r|\n]+/g, '\n').replace(/^\n$/gm, '')
}