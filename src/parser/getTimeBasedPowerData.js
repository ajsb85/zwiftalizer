import getAllMatches from './getAllMatches';

export const regex = /^\[[^\]]*\]\s+?time\spassed:\s[\d\.]*\s+?eventspassed\s+?[\d\.]*\s+?cadence:\s+?[\d\.]*\s+?torque\s+?[\d\.]*$/im;

export default function getTimeBasedPowerData(str) {
  return getAllMatches(str, regex);
}
