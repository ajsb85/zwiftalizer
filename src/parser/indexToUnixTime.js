export default function indexToUnixTime(index) {
  if (!index) {
    return undefined;
  }

  const tokens = index.split('-');

  if (!tokens || !tokens.length || !tokens[1]) {
    return undefined;
  }

  const t = parseInt(tokens[1]);

  return t;
}
