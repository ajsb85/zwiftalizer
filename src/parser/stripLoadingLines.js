import normalize from './normalize';

export default function stripLoadingLines(input) {
  const lines = Array.isArray(input) ? input.join('\n') : input;

  return normalize(
    lines.replace(
      /^\[[^\]]*\]\s+(loading\s+wad|loading\s+old|wad|unable\sto\sload\stexture).*$/gim,
      '\n'
    )
  );
}
