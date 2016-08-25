/**
 * Returns the last seen screen resolution size as a string
 * @param {string} str - The string
 */
export default function resolution(str) {

  // gim = global, case insensitive multiline
  const regex = /^\[[^\]]*\]\s+?changed\s+?resolution\s+?to\s+?\d*\sx\s(\d*)\s+?.*$/gim

  const matches = str.match(regex)

  if (!matches) {
    return undefined
  }

  return matches[matches.length - 1].replace(regex, '$1')
}