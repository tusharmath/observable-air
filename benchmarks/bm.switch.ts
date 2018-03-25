/**
 * Created by tushar on 16/02/17.
 */
import {Suite} from 'benchmark'
import {map} from '../src/core/operators/Map'
import {switchLatest} from '../src/core/operators/Switch'
import {fromArray} from '../src/core/sources/FromArray'
import {array, IDeferred, run} from './lib'

const a = array(1e2)

export function bm_switch(suite: Suite) {
  return suite.add(
    'array(2) -> array(i) -> switchLatest',
    (d: IDeferred) =>
      run(switchLatest(map(i => fromArray(array(i)), fromArray(a))), d),
    {defer: true}
  )
}
