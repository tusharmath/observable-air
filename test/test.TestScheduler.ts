/**
 * Created by tushar on 28/01/17.
 */
import * as t from 'assert'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

test('scheduler()', () => {
  const sh = TestScheduler.of()
  t.strictEqual(sh.now(), 0)

  sh.advanceBy(10)
  t.strictEqual(sh.now(), 10)

  sh.advanceBy(2)
  t.strictEqual(sh.now(), 12)

  sh.advanceTo(20)
  t.strictEqual(sh.now(), 20)
})

test('scheduler()', () => {
  const sh = TestScheduler.of()
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
