import { 
  WAHOO_MANUFACTURER_ID, 
  TACX_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  KURT_MANUFACTURER_ID
 } from './constants';

// lines is assumed to be BTLE lines only, as an array, with times already in unix format using epochify
export default function getBTLEDeviceManufacturer(lines) {
  const str = Array.isArray(lines) ? lines.join('\n') : lines;
  
  if (lines.match(/ble[m]+\s+?:\skickr/gim)) {
    return WAHOO_MANUFACTURER_ID;
  }

  if (lines.match(/bl[m]+\s+?:\stacx/gim)) {
    return TACX_MANUFACTURER_ID;
  }

  if (lines.match(/ble[m]+\s+?:\skinetic/gim)) {
    return KURT_MANUFACTURER_ID
  }

  if (lines.match(/ble[m]+\s+?:\selite/gim)) {
    return ELITE_MANUFACTURER_ID
  }

  if (lines.match(/ble[m]+\s+?:\saris/gim)) {
    return SARIS_MANUFACTURER_ID
  }

  return undefined;
}
