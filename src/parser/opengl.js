import titleCase from './titleCase';
/**
 * Returns the opengl version
 * @param {string} str - The string
 */
export default function opengl(str) {
  const regex = /^\[[^\]]*\]\s+?opengl\s(.*)\sinitialized$/im;

  const match = regex.exec(str);

  if (!match) {
    return undefined;
  }

  return titleCase(match[1]);
}
