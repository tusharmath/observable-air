/**
 * Created by tushar on 28/01/17.
 */
import * as assert from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'

describe('new TestScheduler()', () => {
  describe('now()', () => {
    it('should return current time', () => {
      const sh = createTestScheduler()

      assert.strictEqual(sh.now(), 0)

      sh.advanceBy(10)
      assert.strictEqual(sh.now(), 10)

      sh.advanceBy(2)
      assert.strictEqual(sh.now(), 12)

      sh.advanceTo(20)
      assert.strictEqual(sh.now(), 20)
    })
  })

  describe('start()', () => {
    it('should return TestObserver', () => {
      const sh = createTestScheduler()
      const {results} = sh.start(() =>
        sh.Hot([
          EVENT.next(210, '0'),
          EVENT.next(220, '1'),
          EVENT.next(230, '2'),
          EVENT.complete(240)
        ])
      )

      assert.deepEqual(results, [
        EVENT.next(210, '0'),
        EVENT.next(220, '1'),
        EVENT.next(230, '2'),
        EVENT.complete(240)
      ])
    })
  })

  describe('Hot()', () => {
    it('should create events ', () => {
      const sh = createTestScheduler()
      const {results} = sh.start(() => sh.Hot(EVENT.next(210, '0')))
      assert.deepEqual(results, [EVENT.next(210, '0')])
    })
  })
})
