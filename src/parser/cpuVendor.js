import titleCase from './titleCase'
import removeTrademarksAndCopyrights from './removeTrademarksAndCopyrights'

/**
 * Returns the brand name in the cpu string, usually Intel or AMD
 * @param {string} str - The string
 */
export default function cpuVendor(str) {

  const regex = /^\[[^\]]*\]\s+?cpu:\s+([\w]*).*$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  return titleCase(removeTrademarksAndCopyrights(match[1]))
}
