var _ = require('underscore')

// http://www.intel.com/content/www/us/en/processors/processor-numbers.html

const intelSuffixes = {
  C: 'Desktop processor based on the LGA 1150 package with high performance graphics',
  H: 'High performance graphics',
  K: 'Unlocked',
  M: 'Mobile',
  Q: 'Quad-core',
  R: 'Desktop processor based on BGA1364 (mobile) package with high performance graphics',
  S: 'Performance-optimized lifestyle',
  T: 'Power-optimized lifestyle (probably Alienware Alpha)',
  U: 'Ultra-low power',
  X: 'Extreme edition',
  Y: 'Extremely low power'
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

// PC / Intel Core i7-2600K @ 3.40GHz / Nvidia GeForce GTX 980 Ti/PCIe/SSE2

export default function cpuClass(str) {

  var systemRegex = /\w+\s+\/\s+([^\/]*)\s+\/\s+[^\s]*.*/

  const match = systemRegex.exec(str)

  if (!match) {
    return undefined
  }

  const cpuSpec = match[1]

  // Intel Core i7-2600K @ 3.40GHz
  const cpuRegex = /^intel\s(\w*)\s(i\d)-(\d)(\d+)(\w)?(\w)?\s\@.*/i

  const matches = cpuRegex.exec(cpuSpec)

  if (!matches) {
    return undefined
  }

  matches.forEach((match) => {
    console.log(match)
  })

  const brandModifier = matches[2]

  const generation = humanizeGeneration(matches[3])

  const sku = matches[4]

  const letterSuffix = matches[5]

  const productLineSuffix = matches[6]

  let letterSuffixValue = ''

  let productLineSuffixValue = ''

  if (letterSuffix && _(intelSuffixes).has(letterSuffix)) {
    letterSuffixValue = intelSuffixes[letterSuffix]
  }

  if (productLineSuffix && _(intelSuffixes).has(productLineSuffix)) {
    productLineSuffixValue = intelSuffixes[productLineSuffix]
  }

  return (generation + ' ' + brandModifier + ' - ' + letterSuffixValue + ' ' + productLineSuffixValue).trim()

}
