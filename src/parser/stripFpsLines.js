import normalize from './normalize'

export default function stripFpsLines(input) {

  const lines = Array.isArray(input) ? input.join('\n') : input

  return normalize(lines.replace(/^\[[^\]]*\]\s+?fps[\s\S]*?$/gim, '\n'))
}