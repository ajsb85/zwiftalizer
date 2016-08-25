import getAllMatches from './getAllMatches'

export default function mapAntLines(str) {

  const regex = /^\[[^\]]*\]\s+?(fe-c\s+?\d+\s+?received|ant\s+?:\s+?fet\s+?.*|ant\s+?:\s+?transfer\s+?.*)$/gim

  return getAllMatches(str, regex)
}
