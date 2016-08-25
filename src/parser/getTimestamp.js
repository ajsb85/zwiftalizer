/**
 * Returns the timestamp part of the line as a unixtimestamp (integer)
 * Assumes the log has already had times converted to epoch times (use epochify)
 * @param {input} str - The string
 */

export default function getTimestamp(str) {

  if (!str) {
    return undefined
  }

  let timestamp = 0

  try {
    timestamp = parseInt(str.replace(/^\[([^\]]*)\].*$/, '$1')) / 1000
  } catch (e) {
    console.error('failed to parse timestamp value ', str)
  }

  return timestamp
}