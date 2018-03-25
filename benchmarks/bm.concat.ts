import {Suite} from 'benchmark'
import {concat} from '../src/core/operators/Concat'
import {fromArray} from '../src/core/sources/FromArray'
/**
 * Created by tushar on 05/09/17.
 */
import {array, IDeferred, run} from './lib'

const a = array(1e3)
const b = array(1e3)

export function bm_concat(suite: Suite) {
  return suite.add(
    '(file, file) -> concat',
    (d: IDeferred) => run(concat(fromArray(a), fromArray(b)), d),
    {
      defer: true
    }
  )
}
