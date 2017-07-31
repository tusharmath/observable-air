/**
 * Created by tushar on 10/06/17.
 */

import {Suite} from 'benchmark'
import {multicast} from '../src/operators/Multicast'
import {slice} from '../src/operators/Slice'
import {takeUntil} from '../src/operators/TakeUntil'
import {fromArray} from '../src/sources/FromArray'
import {array, IDeferred, run} from './lib'

const a = array(1e4)

export function bm_takeUntil(suite: Suite) {
  return suite.add(
    'array -> multicast -> takeUntil',
    (d: IDeferred) => {
      const src = multicast(fromArray(a))
      return run(takeUntil(src, slice(5000, Infinity, src)), d)
    },
    {defer: true}
  )
}
