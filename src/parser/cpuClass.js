var _ = require('underscore')

// http://www.intel.com/content/www/us/en/processors/processor-numbers.html

// http://arstechnica.com/gadgets/2016/02/pentium-core-i5-core-i7-making-sense-of-intels-convoluted-cpu-lineup/

const intelSuffixes = {
  C: 'Desktop processor based on the LGA 1150 package with high performance graphics',
  H: 'High performance graphics',
  K: 'Unlocked frequency multiplier',
  M: 'Mobile (laptop)',
  Q: 'Quad-core',
  R: 'Desktop processor based on BGA1364 (mobile) package with high performance graphics (possibly iMac or other all-in-one)',
  S: 'Performance-optimized lifestyle (possibly iMac or other all-in-one)',
  T: 'Power-optimized lifestyle (Alienware Alpha)',
  U: 'Ultra-low power (laptop, mini-pc, all-in-one)',
  X: 'Extreme edition (freakin\' hackers)',
  Y: 'Extremely low power (laptop, notebook, mini-pc, all-in-one)'
}

function humanizeGeneration(num) {

  const gen = ' generation'

  if (typeof(num) === 'undefined') {
    return
  }

  if (num % 100 >= 11 && num % 100 <= 13) {
    return num + 'th' + gen;
  }

  switch (num % 10) {
    case 1:
      return num + 'st' + gen;
    case 2:
      return num + 'nd' + gen;
    case 3:
      return num + 'rd' + gen;
  }

  return num + 'th' + gen;
}

export default function cpuClass(str) {

  var systemRegex = /\w+\s+\/\s+([^\/]*)\s+\/\s+[^\s]*.*/

  const match = systemRegex.exec(str)

  if (!match) {
    return undefined
  }

  const cpuSpec = match[1]

  // Intel Core i7-2600K @ 3.40GHz
  const cpuRegex = /^intel\s(\w*)\s(i\d)-(\d+)(\w)?(\w)?\s\@.*/i

  const matches = cpuRegex.exec(cpuSpec)

  if (!matches) {
    return undefined
  }

  const family = matches[1]

  const brandModifier = matches[2]

  const generation = (matches[3] + '').length === 3 ? '1st generation' : humanizeGeneration(matches[3][0])

  const letterSuffix = matches[4]

  const productLineSuffix = matches[5]

  let letterSuffixValue = undefined

  let productLineSuffixValue = undefined

  if (letterSuffix && _(intelSuffixes).has(letterSuffix)) {
    letterSuffixValue = intelSuffixes[letterSuffix]
  }

  if (productLineSuffix && _(intelSuffixes).has(productLineSuffix)) {
    productLineSuffixValue = intelSuffixes[productLineSuffix]
  }

  let description = generation + ' Intel ' + family + ' family processor';

  if (letterSuffixValue) {
    description += ' - ' + letterSuffixValue
  }

  if (productLineSuffixValue) {
    description += ' ' + productLineSuffixValue
  }

  return description.trim()

}
