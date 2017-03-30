var _ = require('underscore');

import { Event } from 'pondjs';

function nonZeroAvg(values) {
  const nonZeroValues = _.without(values, 0);

  if (!nonZeroValues.length) {
    return 0;
  }

  const sum = _.reduce(
    nonZeroValues,
    (a, b) => {
      return a + b;
    },
    0
  );

  // two decimal places
  return Math.round(sum / nonZeroValues.length * 100) / 100;
}

export function nonZeroAvgReducer(events, fieldSpec) {
  return Event.combine(events, fieldSpec, nonZeroAvg)[0];
}
