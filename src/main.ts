/**
 * Created by tushar.mathur on 11/10/16.
 */

// Observer
export {Observer} from './lib/Observer'

// Operators
import {filter as _filter} from './operators/Filter'
import {join as _join} from './operators/Join'
import {map as _map} from './operators/Map'
import {scan as _scan} from './operators/Scan'
import {slice as _slice} from './operators/Slice'
import {tap as _tap} from './operators/Tap'
import {reduce as _reduce} from './operators/Reduce'

// Sources
import {fromArray as _fromArray} from './sources/FromArray'
import {interval as _interval} from './sources/Interval'
import {fromDOM as _fromDOM} from './sources/FromDOM'
import {Curry} from './lib/Curry'


export const filter = Curry(_filter)
export const join = Curry(_join)
export const map = Curry(_map)
export const scan = Curry(_scan)
export const slice = Curry(_slice)
export const tap = Curry(_tap)
export const reduce = Curry(_reduce)
export const fromArray = Curry(_fromArray)
export const interval = Curry(_interval)
export const fromDOM = Curry(_fromDOM)
