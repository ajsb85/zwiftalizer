import getAllMatches from './getAllMatches';

export default function mapFpsLines(str) {
  const fpsRegex = /^\[[^\]]*\]\s+?fps\s+?.*$/gim;

  return getAllMatches(str, fpsRegex);
}
