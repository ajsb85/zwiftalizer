import getAllMatches from './getAllMatches'

export default function mapNetworkLines(str) {

  const regex = /^\[[^\]]*\]\s+(netclient|network|warn)\s*:.*$/gim

  return getAllMatches(str, regex)
}
