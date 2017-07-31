/**
 * Created by tushar.mathur on 05/11/16.
 */

import {Suite} from 'benchmark'
import {filter} from '../src/operators/Filter'
import {map} from '../src/operators/Map'
import {reduce} from '../src/operators/Reduce'
import {fromArray} from '../src/sources/FromArray'
import {add1, array, even, IDeferred, run, sum} from './lib'

const a = array(1e6)
export function bm_fromArray_map_reduce(suite: Suite) {
  return suite.add(
    'file -> map -> reduce',
    (d: IDeferred) => run(reduce(sum, 0, map(add1, filter(even, fromArray(a)))), d),
    {defer: true}
  )
}
