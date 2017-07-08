/**
 * Returns the game version
 * @param {string} str - The string
 */
export default function gameVersion(str) {
  const regex = /^\[[^\]]*\]\s+?game\s+?version:\s([0-9.]*)$/im;

  const match = regex.exec(str);

  if (!match) {
    return undefined;
  }

  return match[1];
}
