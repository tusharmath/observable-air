/**
 * Created by tushar.mathur on 05/11/16.
 */


import {IDefered, run, passthrough, sum, array} from './lib'
import {reduce} from '../src/operators/Reduce'
import {scan} from '../src/operators/Scan'
import {fromArray} from '../src/sources/FromArray'
import {Suite} from 'benchmark'

const a = array(1e6)
export function fromArray_scan_reduce (suite: Suite) {
  return suite.add(
    'file -> scan -> reduce',
    (d: IDefered) => run(reduce(passthrough, 0, scan(sum, 0, fromArray(a))), d),
    {defer: true}
  )
}
