/**
 * Created by tushar.mathur on 16/10/16.
 */
import test from 'ava'
import {switchLatest} from '../src/operators/Switch'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  const sh = TestScheduler.of()
  const a$$ = sh.Hot([
    EVENT.next(210, 'A0'),
    EVENT.next(220, 'A1'),
    EVENT.next(230, 'A2'),
    EVENT.next(240, 'A3'),
    EVENT.complete(250)
  ])

  const b$$ = sh.Hot([EVENT.next(230, 'B0'), EVENT.next(240, 'B1'), EVENT.complete(250)])

  const source$ = sh.Hot([EVENT.next(205, a$$), EVENT.next(225, b$$), EVENT.complete(300)])
  const {results} = sh.start(() => switchLatest(source$))
  t.deepEqual(results, [
    EVENT.next(210, 'A0'),
    EVENT.next(220, 'A1'),
    EVENT.next(230, 'B0'),
    EVENT.next(240, 'B1'),
    EVENT.complete(300)
  ])
  t.deepEqual(a$$.subscriptions.map(r => r.time), [205, 225])
  t.deepEqual(b$$.subscriptions.map(r => r.time), [225, 300])
})
