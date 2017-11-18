/**
 * Created by tushar.mathur on 02/11/16.
 */
import * as t from 'assert'
import {fromMarble, toMarble} from '../src/testing/Marble'

describe('marble()', () => {
  it('should work for ABC|', () => {
    const expected = 'ABC|'
    const actual = toMarble(fromMarble(expected))
    t.strictEqual(actual, expected)
  })

  it('should work for -ABC|', () => {
    const expected = '-ABC|'
    const actual = toMarble(fromMarble(expected))
    t.strictEqual(actual, expected)
  })

  it('should work for -A-B-C-|', () => {
    const expected = '-A-B-C-|'
    const actual = toMarble(fromMarble(expected))
    t.strictEqual(actual, expected)
  })

  it('should work for -ABC#', () => {
    const expected = '-ABC#'
    const actual = toMarble(fromMarble(expected))
    t.strictEqual(actual, expected)
  })

  it('should ignore whitespaces', () => {
    const message = '   -A B -- C |   '

    const actual = toMarble(fromMarble(message))
    const expected = '-AB--C|'
    t.strictEqual(actual, expected)
  })
})
