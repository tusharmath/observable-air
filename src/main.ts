/**
 * Created by tushar.mathur on 11/10/16.
 */

export {Observable} from './lib/Observable'
export {Observer} from './lib/Observer'
import {Curry} from './lib/Curry'
import {filter as _filter} from './operators/Filter'
import {fromArray as _fromArray} from './sources/FromArray'
import {fromDOM as _fromDOM} from './sources/FromDOM'
import {fromPromise as _fromPromise} from './sources/FromPromise'
import {interval as _interval} from './sources/Interval'
import {join as _join} from './operators/Join'
import {map as _map} from './operators/Map'
import {merge as _merge} from './operators/Merge'
import {reduce as _reduce} from './operators/Reduce'
import {sample as _sample} from './operators/Sample'
import {scan as _scan} from './operators/Scan'
import {skipRepeats as _skipRepeats} from './operators/SkipRepeats'
import {slice as _slice} from './operators/Slice'
import {switchLatest as _switchLatest} from './operators/Switch'
import {tap as _tap} from './operators/Tap'

export const filter = Curry(_filter)
export const fromArray = Curry(_fromArray)
export const fromDOM = Curry(_fromDOM)
export const fromPromise = Curry(_fromPromise)
export const interval = Curry(_interval)
export const join = Curry(_join)
export const map = Curry(_map)
export const merge = Curry(_merge)
export const reduce = Curry(_reduce)
export const sample = Curry(_sample)
export const scan = Curry(_scan)
export const skipRepeats = Curry(_skipRepeats)
export const slice = Curry(_slice)
export const switchLatest = Curry(_switchLatest)
export const tap = Curry(_tap)
