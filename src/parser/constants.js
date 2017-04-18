export const MAX_DEVICES = 4;
export const MAX_MANUFACTURER_ID = 273;

export const BASIC_DEVICE = 0;
export const POWER_METER_DEVICE = 1;
export const SMART_TRAINER_DEVICE = 2;

// known smart trainer manufacturers
export const WAHOO_MANUFACTURER_ID = '32';
export const TACX_MANUFACTURER_ID = '89';
export const ELITE_MANUFACTURER_ID = '86';
export const BKOOL_MANUFACTURER_ID = '67';

export const SMART_TRAINER_MANUFACTURERS = [
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID,
  BKOOL_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID
];

export const WAHOO_KICKR_MODEL_ID = '1';

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
// export const CYCLEOPS_MAGNUS_MODEL_ID = '';
// export const CYCLEOPS_POWERBEAM_MODEL_ID = '';
// export const CYCLEOPS_POWERSYNC_MODEL_ID = '';

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
]