/**
 * Returns all the parts of the string that match the regular expression as an array
 * or an empty array if there are no matches, or if string is undefined
 * @param {input} str - The string, or array of strings
 * @param {regex} regex - the regex pattern to find matches for in the string
 */
export default function getAllMatches(input, regex) {

  if (!input) {
    return []
  }

  const str = Array.isArray(input) ? input.join('\n') : input

  let matches = str.match(regex)

  if (!matches) {
    return []
  }

  return matches
}