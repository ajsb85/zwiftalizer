// call with (logDateTimeAsUnixTimestamp(str), duration(str))

export default function timerange(startTimestamp, durationInSeconds) {

  const startMilliseconds = startTimestamp * 1000

  const endMilliseconds = startMilliseconds + (durationInSeconds * 1000)

  return {
    startMilliseconds,
    endMilliseconds
  }

}