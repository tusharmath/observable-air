/**
 * Created by pankaj on 9/1/17.
 */
import {assert} from 'chai'
import {curry} from './Utils'

describe('Utils', () => {
  const func = curry((a: number, b: number, c: number) => [a, b, c])
  it('should curry(1, 2, 3)', () => {
    assert.deepEqual(func(1, 2, 3), [1, 2, 3])
  })
  it('should curry(1, 2)(3)', () => {
    const func2 = func(1, 2)
    assert.deepEqual(func2(3), [1, 2, 3])
  })
  it('curry(1)(2)(3)', () => {
    assert.deepEqual(func(1)(2)(3), [1, 2, 3])
  })
  it('curry(1, 2, 3, 4)', () => {
    assert.deepEqual(func(1, 2, 3, 4), [1, 2, 3])
  })

  it('curry()', () => {
    const f = curry(() => 'HELLO')
    assert.equal(f(), 'HELLO')
  })
})