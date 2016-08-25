import titleCase from './titleCase'

/**
 * Returns the opengl minor version
 * @param {string} str - The string
 */
export default function openglMinor(str) {

  const regex = /^\[[^\]]*\]\s+?opengl\s+?[\d\.]+?\s+?(.+?)\s+?initialized$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  return titleCase(match[1])
}