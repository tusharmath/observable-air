/**
 * Created by tushar.mathur on 05/11/16.
 */
import {Suite} from 'benchmark'
import {run, array, IDeferred} from './lib'
import {fromArray} from '../src/main'


const a = array(1e6)
export function bm_fromArray_takeN (suite: Suite) {
  return suite
    .add(
      'file -> takeN(0, n/10)',
      (d: IDeferred) => run(fromArray(a).slice(0, 1e6 / 10), d),
      {defer: true}
    )
}
