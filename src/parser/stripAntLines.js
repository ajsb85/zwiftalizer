export default function stripFpsLines(str) {
  return str.replace(/^\[[^\]]*\]\s+?ant[\s\S]*?$/gim, '\n');
}
