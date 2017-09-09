/**
 * Created by tushar on 09/09/17.
 */

import * as assert from 'assert'
import {forEach} from '../src/lib/ForEach'
import {fromMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

describe('forEach()', () => {
  it('should take a function as the default next', () => {
    const sh = TestScheduler.of()
    const $ = sh.Cold('-1234')
    const actual: number[] = []
    forEach((i: number) => actual.push(i), $)
    const expected = ['1', '2', '3', '4']
    sh.advanceBy(300)
    assert.deepEqual(actual, expected)
  })

  it('should take an observer', () => {
    const sh = TestScheduler.of()
    const $ = sh.Cold('-1234|')
    const testObserver = sh.Observer()

    forEach(testObserver, $)
    sh.advanceBy(300)

    const actual = testObserver.results
    const expected = fromMarble('-1234|')

    assert.deepEqual(actual, expected)
  })
})
