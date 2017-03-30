/**
 * Returns the string without (r) (c) (tm) parts, trimmed of leading and trailing spaces
 * @param {string} str - The string
 */
export default function removeTrademarksAndCopyrights(str) {
  return str.replace(/\(r\)|\(c\)|\(tm\)/gi, '').replace(/\s+/g, ' ').trim();
}
