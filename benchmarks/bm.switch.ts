/**
 * Created by tushar on 16/02/17.
 */
import {array, IDeferred, run} from './lib'
import {fromArray} from '../src/sources/FromArray'
import {map} from '../src/operators/Map'
import {Suite} from 'benchmark'
import {switchLatest} from '../src/operators/Switch'

const a = array(1e2)

export function bm_switch (suite: Suite) {
  return suite.add(
    'array(2) -> array(i) -> switchLatest',
    (d: IDeferred) => run(switchLatest(map((i) => fromArray(array(i)), fromArray(a))), d),
    {defer: true}
  )
}
