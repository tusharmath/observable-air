/**
 * Created by tushar.mathur on 06/11/16.
 */

import * as assert from 'assert'
import {Suite} from 'benchmark'
import {toSafeFunction} from '../src/lib/TryCatch'
import {SafeValue} from '../src/lib/SafeValue'

function addThis (b: number) {
  this.a = this.a + b
  return this
}
const safelyAddThis = toSafeFunction(addThis)

function test (message: string, f: Function) {
  assert.deepStrictEqual(f().value.a, 102, message)
}

export function testFunction (): SafeValue<any> {
  return safelyAddThis.call({a: 100}, 2)
}

test('class-based', testFunction)

export function tryCatch (suite: Suite) {
  return suite.add('tryCatch', testFunction)
}
