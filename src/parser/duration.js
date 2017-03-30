var _ = require('underscore');

import toArray from './toArray';
import getTimestamp from './getTimestamp';

/**
 * Returns the duration of the log file in seconds.
 * Assumes the log has already had times converted to epoch times (use epochify)
 * @param {input} str - The log, or array of log lines
 */
export default function duration(str) {
  const lines = Array.isArray(str) ? str : toArray(str);

  const first = lines[0];

  const last = lines[lines.length - 1];

  return getTimestamp(last) - getTimestamp(first);
}
