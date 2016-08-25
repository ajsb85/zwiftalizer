/**
 * Convert total seconds into hours:minutes:seconds
 * @param {number} secs - The total seconds
 */
export default function toHoursMinutesSeconds(secs) {

  const sec = parseInt(secs, 10)

  const hours = Math.floor(sec / 3600) % 24

  const minutes = Math.floor(sec / 60) % 60

  const seconds = sec % 60

  return [hours, minutes, seconds].map(v => v < 10 ? '0' + v : v).join(':')
}