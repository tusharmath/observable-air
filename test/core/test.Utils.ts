/**
 * Created by tushar.mathur on 15/10/16.
 */
import * as t from 'assert'
import {curry} from '../../src/core/internal/Utils'

const func = curry((a: number, b: number, c: number) => [a, b, c])

describe('utils', () => {
  describe('curry', () => {
    it('should fn(1, 2, 3)', () => {
      t.deepEqual(func(1, 2, 3), [1, 2, 3])
    })

    it('should fn(1, 2)(3)', () => {
      const func2 = func(1, 2)
      t.deepEqual(func2(3), [1, 2, 3])
    })

    it('should fn(1)(2)(3)', () => {
      t.deepEqual(func(1)(2)(3), [1, 2, 3])
    })

    it('should fn(1, 2, 3, 4)', () => {
      t.deepEqual(func(1, 2, 3, 4), [1, 2, 3])
    })

    it('should fn()', () => {
      const f = curry(() => 'HELLO')
      t.strictEqual(f(), 'HELLO')
    })
  })
})
