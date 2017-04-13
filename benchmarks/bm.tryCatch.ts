/**
 * Created by tushar.mathur on 06/11/16.
 */
import {Suite} from 'benchmark'
import {ISafeValue, tryCatch} from '../src/lib/Utils'
import {array} from './lib'

function addThis (b: number) {
  this.a = this.a + b
  if (this.a % 2 === 0) {
    throw 'ERROR'
  }
  return this
}
const safelyAddThis = tryCatch(addThis)

export function testFunction (arr: number[]): Array<ISafeValue<any>> {
  const results = []
  for (var i = 0; i < arr.length; ++i) {
    results.push(safelyAddThis.call({a: 100}, i))
  }
  return results
}
const arr = array(1e3)
export function bm_tryCatch (suite: Suite) {
  return suite.add('tryCatch', () => testFunction(arr))
}
