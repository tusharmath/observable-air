/**
 * Created by tushar.mathur on 15/10/16.
 */
import test from 'ava'
import {curry, compose} from '../src/lib/Utils'
const func = curry(
  (a: number, b: number, c: number) => [a, b, c]
)

test('curry(1, 2, 3)', t => {
  t.deepEqual(func(1, 2, 3), [1, 2, 3])
})

test('curry(1, 2)(3)', t => {
  const func2 = func(1, 2)
  t.deepEqual(func2(3), [1, 2, 3])
})

test('curry(1)(2)(3)', t => {
  t.deepEqual((
      (func(1))(2))(3),
    [1, 2, 3]
  )
})

test('curry(1, 2, 3, 4)', t => {
  t.deepEqual(
    func(1, 2, 3, 4),
    [1, 2, 3]
  )
})


test('curry()', t => {
  const f = curry(() => 'HELLO')
  t.is(
    f(),
    'HELLO'
  )
})

test('compose()', t => {
  const c = (x: number, y: number) => x + y
  const b = (x: number) => x + 1000
  const a = (x: number) => x / 100
  t.is(compose(a, b, c)(2, 3), 10.05)
  t.is(compose(a, b, c)(2)(3), 10.05)
})
