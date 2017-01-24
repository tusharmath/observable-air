/**
 * Created by tushar.mathur on 05/11/16.
 */
import {Suite} from 'benchmark'
import {run, sum, add1, even, array, IDeferred} from './lib'
import {fromArray} from '../src/main'

const a = array(1e6)
export function bm_fromArray_map_reduce (suite: Suite) {
  return suite.add(
    'file -> map -> reduce',
    (d: IDeferred) => {
      return run(fromArray(a).filter(even).map(add1).reduce(sum, 0), d)
    },
    {defer: true}
  )
}
