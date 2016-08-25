/**
 * Returns whether the log came from a Mac or Pc
 * @param {str} str - The log. Can be a substring from the log.
 */
export default function platform(str) {
  // Oddly, mac has \n line endings, sometimes, but PC never does.
  // This might not be a reliable way to determine Mac or PC whatsoever.
  // regex says, match one or more chars that are NOT carriage (r)eturn or li(n)e feed (? non greedy), followed by a li(n)e feed
  // Returns first match (no /g modifier).
  //if (str.match(/\n\r\n/)) {
  return (str.match(/([^\r]+?)\n/)) ? 'Mac' : 'PC'
}