/**
 * Created by tushar.mathur on 15/10/16.
 */

import test from 'ava'
import {Curry} from '../src/lib/Curry'
const func = Curry(
  (a: number, b: number, c: number) => [a, b, c]
)

test('func(1, 2, 3)', t => {
  t.deepEqual(func(1, 2, 3), [1, 2, 3])
})

test('func(1, 2)(3)', t => {
  const func2 = func(1, 2)
  t.deepEqual(func2(3), [1, 2, 3])
})

test('func(1)(2)(3)', t => {
  t.deepEqual((
      (func(1))(2))(3),
    [1, 2, 3]
  )
})

test('func(1, 2, 3, 4)', t => {
  t.deepEqual(
    func(1, 2, 3, 4),
    [1, 2, 3]
  )
})


test('func()', t => {
  const f = Curry(() => 'HELLO')
  t.is(
    f(),
    'HELLO'
  )
})

