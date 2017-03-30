/**
 * Returns the last seen graphics profile
 * @param {string} str - The string
 */
export default function profile(str) {
  // gim = global, case insensitive multiline
  const regex = /^\[[^\]]*\]\s+?using\s+?([\w]*)\s+?graphics\s+?profile$/gim;

  const matches = str.match(regex);

  if (!matches) {
    return undefined;
  }

  return matches[matches.length - 1].replace(regex, '$1');
}
