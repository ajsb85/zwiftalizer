const trim = require('lodash.trim');
const uniq = require('lodash.uniq');

module.exports.tokenize = function tokenize(str) {
  const noiseWords = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    'pcie',
    'sse2',
    'multiplier',
    'frequency',
    'pc',
    'all',
    'in',
    'one',
    'family',
    'generation',
    'can',
    'or',
    'possibly',
    'performance',
    'processor',
    'graphics',
    'extremely',
    'performance',
    'opengl',
    'engine',
    'with',
    'graphics',
    '200',
    'ati',
    'hd',
    'series'
  ];

  const input = trim(str);
  const regex = /([^,\(\)\[\]\s\/@-]+)/g;
  const items = [];
  let matches;

  while ((matches = regex.exec(input))) {
    let term = matches[1];

    if (!term) {
      continue;
    }

    term = term.toLowerCase().replace('"', '');

    if (noiseWords.includes(term)) {
      continue;
    }

    items.push(term);
  }
  return uniq(items).sort();
};
