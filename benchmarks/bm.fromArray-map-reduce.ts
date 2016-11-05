/**
 * Created by tushar.mathur on 05/11/16.
 */


import {fromArray} from '../src/sources/FromArray'
import {filter} from '../src/operators/Filter'
import {map} from '../src/operators/Map'
import {reduce} from '../src/operators/Reduce'
import {Suite} from 'benchmark'
import {run, sum, add1, even, array} from './lib'

const a = array(1e6)
export function fromArray_map_reduce (suite: Suite) {
  return suite.add(
    'file -> map -> reduce',
    (d: any) => run(reduce(sum, 0, map(add1, filter(even, fromArray(a)))), d),
    {defer: true}
  )
}
