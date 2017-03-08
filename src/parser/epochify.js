var _ = require('underscore')
var moment = require('moment')

import startDateTime from './startDateTime'
import toArray from './toArray'

const ansiDateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'
const dateTimeFormat = ansiDateFormat + ' ' + timeFormat
const timeDateFormat = timeFormat + ' ' + ansiDateFormat

export default function epochify(str, callback) {

  if (!str) {
    callback('empty string', []);
  }

  const start = startDateTime(str)

  if (!start) {
    callback('invaid start date', []);
  }

  // get all the log entries into an array
  const entries = toArray(str)

  const startMoment = moment(start, timeDateFormat)

  // clones the startMoment and zeros the hour, minutes, seconds
  let logDay = moment(startMoment).startOf('day')

  // keep track of what the hour is so that we know when to add 24 hours to the day
  let lastHour = null

  let logDayFormatted = logDay.format(ansiDateFormat)

  const convertAll = function () {

    var lines = []

    // for entry at index position n, convert the time to a unixtimestamp,
    // and add the result to the new lines array

    const convertDates = function (n) {

      const matches = entries[n].match(/^\[([^\]]*)\]\s+?(.*)$/i)

      if (!matches || matches.length < 3) {
        return
      }

      const time = matches[1]

      const value = matches[2]

      const hour = (time.split(':')[0]) / 1

      if (_.isNull(lastHour)) {
        lastHour = hour
      }

      if (hour > lastHour) {
        lastHour = hour
      }

      // assuming the log is in time ascending, if the next hour is less than
      // the previous then we have gone into a new day
      if (hour < lastHour) {
        lastHour = hour
        logDay = logDay.add(24, 'hours')
        logDayFormatted = logDay.format(ansiDateFormat)
      }

      // prefix each time entry with the date then convert to unix timestamp
      // const timestamp = moment(logDayFormatted + ' ' + time, dateTimeFormat).unix() * 1000

      // 20% faster
      const timestamp = Date.parse(logDayFormatted + ' ' + time, dateTimeFormat)

      lines.push('[' + timestamp + '] ' + value)
    }

    // batch calls to convertDates to not block the main js thread
    var n = 0;
    var max = entries.length;
    var batch = 250;

    (function nextBatch() {
      for (var i = 0; i < batch && n < max; ++i, ++n) {
        convertDates(n);
      }

      if (n < max) {
        setTimeout(nextBatch, 0);
      } else {
        // done, pass the data back to the callback function
        callback(null /* no erro*/ , lines);
      }

    })()

  }

  convertAll()

}
