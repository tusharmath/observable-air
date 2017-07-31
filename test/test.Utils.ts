/**
 * Created by tushar.mathur on 15/10/16.
 */
import test from 'ava'
import {curry} from '../src/lib/Utils'
const func = curry((a: number, b: number, c: number) => [a, b, c])

test('curry(1, 2, 3)', t => {
  t.deepEqual(func(1, 2, 3), [1, 2, 3])
})

test('curry(1, 2)(3)', t => {
  const func2 = func(1, 2)
  t.deepEqual(func2(3), [1, 2, 3])
})

test('curry(1)(2)(3)', t => {
  t.deepEqual(func(1)(2)(3), [1, 2, 3])
})

test('curry(1, 2, 3, 4)', t => {
  t.deepEqual(func(1, 2, 3, 4), [1, 2, 3])
})

test('curry()', t => {
  const f = curry(() => 'HELLO')
  t.is(f(), 'HELLO')
})
