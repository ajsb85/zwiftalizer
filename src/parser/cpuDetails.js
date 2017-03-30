import removeTrademarksAndCopyrights from './removeTrademarksAndCopyrights';

/**
 * Returns the specs that follow the brand name in the cpu string
 * @param {string} str - The string
 */
export default function cpuDetails(str) {
  const regex = /^\[[^\]]*\]\s+?cpu:\s*([\w\d]*)\s*(.*)$/im;

  const match = regex.exec(str);

  if (!match) {
    return undefined;
  }

  if (match[1] && match[1].toLowerCase() === 'arm64') {
    return match[1];
  }

  return removeTrademarksAndCopyrights(match[2].replace(/\s+?cpu\s?/i, ' '));
}
