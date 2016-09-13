var _ = require('underscore')
var moment = require('moment')

import startDateTime from './startDateTime'
import toArray from './toArray'

const ansiDateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'
const dateTimeFormat = ansiDateFormat + ' ' + timeFormat
const timeDateFormat = timeFormat + ' ' + ansiDateFormat

export default function epochify(str) {

  var lines = []

  if (!str) {
    return lines
  }

  const start = startDateTime(str)

  if (!start) {
    return lines
  }

  // get all the log entries into an array
  const entries = toArray(str)

  const startMoment = moment(start, timeDateFormat)

  // clones the startMoment and zeros the hour, minutes, seconds
  let logDay = moment(startMoment).startOf('day')

  // keep track of what the hour is so that we know when to add 24 hours to the day
  let lastHour = null

  let logDayFormatted = logDay.format(ansiDateFormat)

  // for each entry, convert the time to a unixtimestamp,
  // and add the result to the new lines array

  // @todo, this loop hogs the thread for long logs
  // (Test with 10 MB file in Firefox)
  // figure out the length, call a separate function with a setTimeout to
  // yeild to the UI
  // loop over chunks until length is done.

  _.each(entries, entry => {

    const matches = entry.match(/^\[([^\]]*)\]\s+?(.*)$/i)

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

    // prefix each time entry with the datem then convert to unix timestamp
    const timestamp = moment(logDayFormatted + ' ' + time, dateTimeFormat).unix() * 1000

    lines.push('[' + timestamp + '] ' + value)

  });

  return lines

}
