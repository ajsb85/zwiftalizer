import { TimeSeries } from 'pondjs';

export default function timeAxis(
  startTimestamp,
  endTimestamp,
  defaultValue = 0
) {
  // milliseconds
  const step = 1000;

  const timestamps = [];

  for (let i = startTimestamp; i < endTimestamp; i += step) {
    timestamps.push([i, defaultValue]);
  }

  // make a complete x-axis timeseries of all zeros
  const timeAxisTimeSeries = new TimeSeries({
    name: 'xaxis',
    columns: ['time', 'value'],
    points: timestamps
  });

  return timeAxisTimeSeries;
}
