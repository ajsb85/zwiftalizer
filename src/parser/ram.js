/**
 * Returns the RAM size
 * @param {string} str - The string
 */
export default function ram(str) {
  const regex = /^\[[^\]]*\]\s+?ram:\s+(.*)$/im;

  const match = regex.exec(str);

  if (!match) {
    return undefined;
  }

  return match[1];
}
