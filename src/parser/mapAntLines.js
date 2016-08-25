import getAllMatches from './getAllMatches'

export default function mapAntLines(str) {

  const regex = /^\[[^\]]*\]\s+(ant|calibration)\s+.*$/gim

  return getAllMatches(str, regex)
}
