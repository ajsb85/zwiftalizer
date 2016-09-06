/**
 * Returns the first N chars of the string, or the whole string if length < N
 * @param {string} str - The string
 * @param {number} n - the number of chars to return. Default 65,536.
 */
export default function head(str, n = Math.pow(2, 16)) {

  if (!str) {
    return undefined
  }

  return (n > str.length - 1) ? str : str.substring(0, n)
}
