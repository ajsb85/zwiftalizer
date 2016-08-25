import titleCase from './titleCase'
import removeTrademarksAndCopyrights from './removeTrademarksAndCopyrights'

/**
 * Returns the gpu brand name in the gpu string, usually Nvidia, Intel or AMD
 * @param {string} str - The string
 */
export default function gpuVendor(str) {

  const regex = /^\[[^\]]*\]\s+?graphics\s+?vendor:\s+([\w]*).*$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  return titleCase(removeTrademarksAndCopyrights(match[1]))
}