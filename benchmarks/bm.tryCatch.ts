/**
 * Created by tushar.mathur on 06/11/16.
 */
import * as assert from 'assert'
import {Suite} from 'benchmark'
import {SafeValue} from '../src/lib/SafeValue'
import {toSafeFunction} from '../src/lib/ToSafeFunction'
import {array} from './lib'

function addThis (b: number) {
  this.a = this.a + b
  if (this.a % 2 === 0) {
    throw 'ERROR'
  }
  return this
}
const safelyAddThis = toSafeFunction(addThis)

function test (message: string, f: Function) {
  assert.deepStrictEqual(f(), [
    new SafeValue('ERROR'),
    new SafeValue({a: 101}),
    new SafeValue('ERROR')
  ], message)
}


export function testFunction (arr: number[]): Array<SafeValue<any>> {
  const results = []
  for (var i = 0; i < arr.length; ++i) {
    results.push(safelyAddThis.call({a: 100}, i))
  }
  return results
}

test('class-based', () => testFunction([0, 1, 2]))

const arr = array(1e3)
export function bm_tryCatch (suite: Suite) {
  return suite.add('tryCatch', () => testFunction(arr))
}
