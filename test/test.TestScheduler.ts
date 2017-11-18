/**
 * Created by tushar on 28/01/17.
 */
import * as t from 'assert'
import {EVENT} from '../src/testing/Events'
import {createTestScheduler} from '../src/testing/TestScheduler'

describe('new TestScheduler()', () => {
  it('should just ... ', () => {
    const sh = createTestScheduler()
    t.strictEqual(sh.now(), 0)

    sh.advanceBy(10)
    t.strictEqual(sh.now(), 10)

    sh.advanceBy(2)
    t.strictEqual(sh.now(), 12)

    sh.advanceTo(20)
    t.strictEqual(sh.now(), 20)
  })

  it('should just ... ', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      sh.Hot([
        EVENT.next(210, '0'),
        EVENT.next(220, '1'),
        EVENT.next(230, '2'),
        EVENT.complete(240)
      ])
    )

    t.deepEqual(results, [
      EVENT.next(210, '0'),
      EVENT.next(220, '1'),
      EVENT.next(230, '2'),
      EVENT.complete(240)
    ])
  })
})
