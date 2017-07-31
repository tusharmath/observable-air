/**
 * Created by tushar.mathur on 05/11/16.
 */

import {Suite} from 'benchmark'
import {reduce} from '../src/operators/Reduce'
import {scan} from '../src/operators/Scan'
import {fromArray} from '../src/sources/FromArray'
import {array, IDeferred, passthrough, run, sum} from './lib'

const a = array(1e6)
export function bm_fromArray_scan_reduce(suite: Suite) {
  return suite.add(
    'file -> scan -> reduce',
    (d: IDeferred) =>
      run(reduce(passthrough, 0, scan(sum, 0, fromArray(a))), d),
    {defer: true}
  )
}
