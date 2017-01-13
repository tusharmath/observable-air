/**
 * Created by tushar on 08/12/16.
 */
import {Suite} from 'benchmark'
import {run, array, IDeferred} from './lib'
import {combine, fromArray} from '../src/main'

const a = array(1e2)
const b = array(1e2)
const c = array(1e2)
const sum3 = (a: number, b: number, c: number) => a + b + c
const sum2 = (a: number, b: number) => a + b

export function bm_fromArray_combine (suite: Suite) {
  return suite
    .add(
      'file -> combine(sum3, [a, b, c]) -> reduce(sum2, 0)',
      (d: IDeferred) => run(combine(sum3, [fromArray(a), fromArray(b), fromArray(c)]).reduce(sum2, 0), d),
      {defer: true}
    )
}
