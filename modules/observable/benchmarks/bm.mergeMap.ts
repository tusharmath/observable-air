/**
 * Created by tushar on 31/08/17.
 */

import {Suite} from 'benchmark'
import {mergeMap} from '../src/operators/MergeMap'
import {just} from '../src/sources/Create'
import {fromArray} from '../src/sources/FromArray'
import {array, IDeferred, run} from './lib'

const a = array(1e3).map(i => array(1e3))

export function bm_mergeMap(suite: Suite) {
  return suite.add(
    'file -> mergeMap',
    (d: IDeferred) => run(mergeMap(just(1e2), fromArray, fromArray(a)), d),
    {
      defer: true
    }
  )
}
