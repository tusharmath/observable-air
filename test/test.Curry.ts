/**
 * Created by tushar.mathur on 15/10/16.
 */

import test from 'ava'
import {Curry} from '../src/lib/Curry'
import {ICurryFunction} from '../src/types/ICurryFunction'

const func = Curry<number[], number>(
  (a: number, b: number, c: number) => [a, b, c]
)


test('func(1, 2, 3)', t => {
  t.deepEqual(func(1, 2, 3), [1, 2, 3])
})

test('func(1, 2)(3)', t => {
  const func2 = func(1, 2) as ICurryFunction<number[]>
  t.deepEqual(func2(3), [1, 2, 3])
})

test('func(1)(2)(3)', t => {
  t.deepEqual((
      (func(1) as ICurryFunction<number[]>)(2) as ICurryFunction<number[]>)(3),
    [1, 2, 3]
  )
})
