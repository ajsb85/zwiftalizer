import titleCase from './titleCase'

/**
 * Returns the opengl major version
 * @param {string} str - The string
 */
export default function openglMajor(str) {

  const regex = /^\[[^\]]*\]\s+?opengl\s+?([\d\.]+?)\s+?.*initialized$/im

  const match = regex.exec(str)

  if (!match) {
    return undefined
  }

  return titleCase(match[1])
}