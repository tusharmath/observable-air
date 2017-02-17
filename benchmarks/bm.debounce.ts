/**
 * Created by tushar on 12/02/17.
 */
import {array, run, IDeferred} from './lib'
import {debounce} from '../src/operators/Debounce'
import {fromArray} from '../src/sources/FromArray'
import {Suite} from 'benchmark'

const a = array(1e3)
export function bm_debounce (suite: Suite) {
  return suite.add(
    'file -> debounce',
    (d: IDeferred) => run(debounce(100, fromArray(a)), d),
    {defer: true}
  )
}
