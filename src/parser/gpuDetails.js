import removeTrademarksAndCopyrights from './removeTrademarksAndCopyrights'

/**
 * Returns the gpu specs from the gpu renderer string
 * @param {string} str - The string
 */
export default function gpuDetails(str) {

  const regex = /^\[[^\]]*\]\s+?graphics\s+?renderer:\s+?(.*)$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  const cleaned = removeTrademarksAndCopyrights(match[1])

  return cleaned
}