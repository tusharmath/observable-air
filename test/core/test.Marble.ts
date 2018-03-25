/**
 * Created by tushar.mathur on 02/11/16.
 */
import * as assert from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {fromMarble, toMarble} from '../../src/core/internal/Marble'

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

  it('should parse multi-letter messages', () => {
    const message = '   -(ABC)-(PQR)-|'
    const actual = fromMarble(message)
    const expected = [
      EVENT.next(201, 'ABC'),
      EVENT.next(203, 'PQR'),
      EVENT.complete(205)
    ]
    assert.deepEqual(actual, expected)
  })

  it('should create multi-letter messages', () => {
    const actual = toMarble([
      EVENT.next(201, 'ABC'),
      EVENT.next(203, 'PQR'),
      EVENT.complete(205)
    ])
    const expected = '-(ABC)-(PQR)-|'
    assert.deepEqual(actual, expected)
  })

  it('should interop with multi-letter messages', () => {
    const test = '--a--(bc)--p(qr)--|'
    const actual = toMarble(fromMarble(test))
    const expected = test
    assert.strictEqual(actual, expected)
  })

  it('should auto convert values to numbers if possible', () => {
    const message = '--1-2-3-4'
    const actual = fromMarble(message)
    const expected = [
      EVENT.next(202, 1),
      EVENT.next(204, 2),
      EVENT.next(206, 3),
      EVENT.next(208, 4)
    ]

    assert.deepEqual(actual, expected)
  })
})
