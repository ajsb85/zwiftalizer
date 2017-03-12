export const MAX_DEVICES = 4
export const MAX_MANUFACTURER_ID = 273

export const BASIC_DEVICE = 0
export const POWER_METER_DEVICE = 1
export const FEC_DEVICE = 2
export const WAHOO_KICKR_DEVICE = 3

// known smart trainer manufacturers
export const WAHOO_MANUFACTURER_ID = '32'
export const TACX_MANUFACTURER_ID = '89'
export const ELITE_MANUFACTURER_ID = '86'
export const BKOOL_MANUFACTURER_ID = '67'

export const WAHOO_KICKR_MODEL_ID = '1'

export const SARIS_HAMMER_MODEL_ID = '320'

export const SRM_MANUFACTURER_ID = '6'
export const QUARK_MANUFACTURER_ID = '7'
export const SARIS_MANUFACTURER_ID = '9'
export const PIONEER_MANUFACTURER_ID = '48'
export const FOUREYES_MANUFACTURER_ID = '51'
export const ROTOR_MANUFACTURER_ID = '60'
export const STAGES_MANUFACTURER_ID = '69'
export const LOOK_MANUFACTURER_ID = '99'
export const GARMIN_MANUFACTURER_ID = '1'
export const WATTTEAM_MANUFACTURER_ID = '261'
export const FAVERO_MANUFACTURER_ID = '263'

export const SMART_TRAINER_MANUFACTURERS = [
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID,
  BKOOL_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID
]

// these are to try and identify ant+ powersources that are not also smart trainers
export const POWERMETER_MANUFACTURERS = [
  SRM_MANUFACTURER_ID,
  QUARK_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  PIONEER_MANUFACTURER_ID,
  FOUREYES_MANUFACTURER_ID,
  ROTOR_MANUFACTURER_ID,
  STAGES_MANUFACTURER_ID,
  LOOK_MANUFACTURER_ID,
  GARMIN_MANUFACTURER_ID,
  WATTTEAM_MANUFACTURER_ID,
  FAVERO_MANUFACTURER_ID,
  WAHOO_MANUFACTURER_ID
]
