import removeTrademarksAndCopyrights from './removeTrademarksAndCopyrights'

/**
 * Returns the specs that follow the brand name in the cpu string
 * @param {string} str - The string
 */
export default function cpuDetails(str) {

  const regex = /^\[[^\]]*\]\s+?cpu:\s*[\w]*\s*(.*)$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  const cleaned = removeTrademarksAndCopyrights(match[1].replace(/\s+?cpu\s?/i, ' '))

  return cleaned
}