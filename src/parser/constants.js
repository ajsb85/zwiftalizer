export const MAX_DEVICES = 4;
/* export const MAX_MANUFACTURER_ID = 273; */
export const MAX_MANUFACTURER_ID = 253;

export const BASIC_DEVICE = 0;
export const POWER_METER_DEVICE = 1;
export const SMART_TRAINER_DEVICE = 2;

// known smart trainer manufacturers
export const WAHOO_MANUFACTURER_ID = '32';
export const TACX_MANUFACTURER_ID = '89';
export const ELITE_MANUFACTURER_ID = '86';
export const BKOOL_MANUFACTURER_ID = '67';
export const WATTBIKE_MANUFACTURER_ID = '73';
export const KURT_MANUFACTURER_ID = '199'; /* I made this up, there is no ID for Kurt in the ANT+ registry */

export const SRM_MANUFACTURER_ID = '6';
export const QUARQ_MANUFACTURER_ID = '7';
export const SARIS_MANUFACTURER_ID = '9';
export const PIONEER_MANUFACTURER_ID = '48';
export const FOUREYES_MANUFACTURER_ID = '51';
export const ROTOR_MANUFACTURER_ID = '60';
export const STAGES_MANUFACTURER_ID = '69';
export const LOOK_MANUFACTURER_ID = '99';
export const GARMIN_MANUFACTURER_ID = '1';
export const WATTTEAM_MANUFACTURER_ID = '261';
export const FAVERO_MANUFACTURER_ID = '263';
export const SAXONAR_MANUFACTURER_ID = '29';

export const WAHOO_KICKR_MODEL_ID = '1';

// these are to try and identify ant+ powersources that are NOT also smart trainers
// SARIS_MANUFACTURER_ID is the odd one out
export const POWERMETER_MANUFACTURERS = [
  SRM_MANUFACTURER_ID,
  QUARQ_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  PIONEER_MANUFACTURER_ID,
  FOUREYES_MANUFACTURER_ID,
  FAVERO_MANUFACTURER_ID,
  ROTOR_MANUFACTURER_ID,
  STAGES_MANUFACTURER_ID,
  LOOK_MANUFACTURER_ID,
  GARMIN_MANUFACTURER_ID,
  WATTTEAM_MANUFACTURER_ID,
  WAHOO_MANUFACTURER_ID,
  SAXONAR_MANUFACTURER_ID
];

export const CYCLEOPS_HAMMER_MODEL_ID = '320';
export const CYCLEOPS_MAGNUS_MODEL_ID = '328';

// SARIS makes both CycleOps and PowerTap products so
// this collection is to try and tell them apart
// These are the most common, current powertap models

export const POWERTAP_C1_MODEL_ID = '272';
export const POWERTAP_P1_MODEL_ID = '288';
export const POWERTAP_G3_MODEL_ID = '4096';

export const POWERTAP_MODELS = [
  POWERTAP_C1_MODEL_ID,
  POWERTAP_P1_MODEL_ID,
  POWERTAP_G3_MODEL_ID
];

export const CYCLEOPS_TRAINER_MODELS = [
  CYCLEOPS_HAMMER_MODEL_ID,
  CYCLEOPS_MAGNUS_MODEL_ID
];

export const SMART_TRAINER_MANUFACTURERS = [
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID,
  BKOOL_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  WATTBIKE_MANUFACTURER_ID,
  KURT_MANUFACTURER_ID
];

export const ANT_AVERAGES_WINDOW_IN_SEC = 3;

// Speed/Cadence sensor can transmit at these rates
//
// 1. 8102 counts (~4.04Hz, 4 messages/second)
// 2. 16204 counts (~2.02Hz, 2 messages/second)
// 3. 32408 counts (~1.01Hz, 1 message/second)
//
// Ref.
// D00001163_-_ANT+_Device_Profile_-_Bicycle_Speed_and_Cadence_2.0.pdf
// Page 29

export const FOUR_HZ = 4.0;

// ANT+ Powermeter
// Data is transmitted from the bike power sensor every 8182/32768 seconds
// (approximately 4.00 Hz)
//
// Ref.
//
// D00001086_-_ANT+_Device_Profile_-_Bicycle_Power_-_Rev4.2.pdf
// Page 19

export const EIGHT_HZ = 8.0;

export const TACX_NEO_MODEL_IDS = ['1', '2800'];
