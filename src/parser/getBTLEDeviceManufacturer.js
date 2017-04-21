//@todo, add Kinetic, CycleOps and Elite
import { WAHOO_MANUFACTURER_ID, TACX_MANUFACTURER_ID } from './constants';

// lines is assumed to be BTLE lines only, as an array, with times already in unix format using epochify
export default function getBTLEDeviceManufacturer(lines) {
  const str = Array.isArray(lines) ? lines.join('\n') : lines;
  
  if (lines.match(/blem:\skickr/gim)) {
    return WAHOO_MANUFACTURER_ID;
  }

  if (lines.match(/ble:\stacx/gim)) {
    return TACX_MANUFACTURER_ID;
  }

  return undefined;
}
