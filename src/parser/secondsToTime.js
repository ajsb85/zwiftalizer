const moment = require('moment');

/**
 * Convert seconds to time string (hh:mm:ss).
 *
 * @param Number s
 *
 * @return String
 */
export default function secondsToTime(s) {
  return moment.unix(s).format('HH:mm:ss');
}
