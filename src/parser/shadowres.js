/**
 * Returns the last seen shadow resolution size as a string
 * @param {string} str - The string
 */
export default function shadowres(str) {

  // gim = global, case insensitive multiline
  const regex = /^\[[^\]]*\]\s+?changed\s+?shadow\s+?resolution\s+?to\s+?\d*\sx\s(\d*)\s+?.*$/gim

  const matches = str.match(regex)

  if (!matches) {
    return undefined
  }

  return matches[matches.length - 1].replace(regex, '$1')
}