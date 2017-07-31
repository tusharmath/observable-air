/**
 * Created by tushar.mathur on 05/11/16.
 */

import {Suite} from 'benchmark'
import {slice} from '../src/operators/Slice'
import {fromArray} from '../src/sources/FromArray'
import {array, IDeferred, run} from './lib'

const a = array(1e6)
export function bm_fromArray_takeN(suite: Suite) {
  return suite.add(
    'file -> takeN(0, n/10)',
    (d: IDeferred) => run(slice(0, 1e6 / 10, fromArray(a)), d),
    {defer: true}
  )
}
