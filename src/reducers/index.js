import {
  combineReducers
} from 'redux'

import reader from './reader'
import system from './system'
import activity from './activity'
import graphics from './graphics'
import ant from './ant'
import network from './network'
import benchmarks from './benchmarks'
import preferences from './preferences'

const reducers = {
  reader,
  system,
  activity,
  graphics,
  ant,
  network,
  benchmarks,
  preferences
}

const combinedReducers = combineReducers(reducers)

export default combinedReducers
