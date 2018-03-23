/**
 * Created by tushar.mathur on 02/11/16.
 */
import * as assert from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble, toMarble} from '../src/internal/Marble'

describe('marble()', () => {
  it('should work for ABC|', () => {
    const expected = 'ABC|'
    const actual = toMarble(fromMarble(expected))
    assert.strictEqual(actual, expected)
  })

  it('should work for -ABC|', () => {
    const expected = '-ABC|'
    const actual = toMarble(fromMarble(expected))
    assert.strictEqual(actual, expected)
  })

  it('should work for -A-B-C-|', () => {
    const expected = '-A-B-C-|'
    const actual = toMarble(fromMarble(expected))
    assert.strictEqual(actual, expected)
  })

  it('should work for -ABC#', () => {
    const expected = '-ABC#'
    const actual = toMarble(fromMarble(expected))
    assert.strictEqual(actual, expected)
  })

  it('should ignore whitespaces', () => {
    const message = '   -A B -- C |   '

    const actual = toMarble(fromMarble(message))
    const expected = '-AB--C|'
    assert.strictEqual(actual, expected)
  })

  it('should auto convert values to numbers if possible', () => {
    const message = '--1-2-3-4'
    const actual = fromMarble(message)
    const expected = [
      EVENT.next(220, 1),
      EVENT.next(240, 2),
      EVENT.next(260, 3),
      EVENT.next(280, 4)
    ]

    assert.deepEqual(actual, expected)
  })
})
