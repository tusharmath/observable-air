/**
 * Created by tushar.mathur on 05/11/16.
 */
import {run, passthrough, sum, array, IDeferred} from './lib'
import {Suite} from 'benchmark'
import {fromArray} from '../src/main'


const a = array(1e6)
export function bm_fromArray_scan_reduce (suite: Suite) {
  return suite.add(
    'file -> scan -> reduce',
    (d: IDeferred) => run(fromArray(a).scan(sum, 0).reduce(passthrough, 0), d),
    {defer: true}
  )
}
