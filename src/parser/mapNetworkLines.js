import getAllMatches from './getAllMatches'

export default function mapNetworkLines(str) {

  const regex = /^\[[^\]]*\]\s+(netclient|network):.*$/gim

  return getAllMatches(str, regex)
}
