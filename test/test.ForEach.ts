/**
 * Created by tushar on 09/09/17.
 */

import * as assert from 'assert'
import {createTestScheduler} from '../src/schedulers/TestScheduler'
import {forEach} from '../src/sinks/ForEach'

describe('forEach()', () => {
  context('when a function is passed', () => {
    it('should forward values', () => {
      const sh = createTestScheduler()
      const $ = sh.Cold('-1234')

      const expected = ['1', '2', '3', '4']
      const actual: number[] = []

      sh.startSubscription(() => forEach((i: number) => actual.push(i), $))
      assert.deepEqual(actual, expected)
    })
    it('should unsubscribe from the source on error', () => {
      const sh = createTestScheduler()
      const expected = '^---!'
      const testObservable = sh.Hot('-123#')
      assert.throws(
        () =>
          sh.startSubscription(() => forEach(() => void 0, testObservable, sh)),
        '#'
      )

      const actual = testObservable.toString()
      assert.strictEqual(actual, expected)
    })
  })

  context('when an observer is passed', () => {
    it('should forward values', () => {
      const sh = createTestScheduler()
      const $ = sh.Hot('-1234|')

      const testObserver = sh.Observer()

      sh.startSubscription(() => forEach(testObserver, $))

      const actual = testObserver.toString()
      const expected = '-1234|'

      assert.strictEqual(actual, expected)
    })
    it('should forward errors', () => {
      const sh = createTestScheduler()
      const expected = '-123#'

      const testObservable = sh.Hot(expected)
      const testObserver = sh.Observer()

      sh.startSubscription(() => forEach(testObserver, testObservable, sh))

      const actual = testObserver.toString()

      assert.strictEqual(actual, expected)
    })
  })
})
