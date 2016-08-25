/**
 * Returns the date from the first instance of the date time entry
 * @param {input} The log, or substring from the log, or array of log entries
 */
export default function startDateTime(input) {

  const lines = Array.isArray(input) ? input.join('\n') : input

  const regex = /^\[[^\]]*\]\s+?log\s+?time:\s+?([\d:]*\s+?[\d-]*)$/im

  const match = regex.exec(lines)

  return match ? match[1] : undefined
}