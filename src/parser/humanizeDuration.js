var moment = require('moment')

/**
 * Convert hours:minutes:seconds into a humanly readable format
 * @param {str} hours:minutes:seconds
 */

export default function humanizeDuration(str) {

  const m = moment.duration(str)

  const hours = m.hours()

  const mins = m.minutes()

  const seconds = m.seconds()

  let humanizedDuration = ''

  if (hours > 0) {
    humanizedDuration = hours + ' hr' + (hours > 1 ? 's' : '') + ' ' + mins + ' min' + (mins > 1 ? 's' : '')
  } else if (mins > 0) {
    humanizedDuration = mins + ' min' + (mins > 1 ? 's' : '') + ' ' + seconds + ' sec'
  } else if (seconds > 0) {
    humanizedDuration = seconds + ' sec'
  }

  return humanizedDuration
}