/**
 * Created by tushar.mathur on 16/10/16.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {from} from '../src/Main'

test(t => {
  const sh = TestScheduler.of()
  const a$$ = sh.Hot([
    ReactiveEvents.next(210, 'A0'),
    ReactiveEvents.next(220, 'A1'),
    ReactiveEvents.next(230, 'A2'),
    ReactiveEvents.next(240, 'A3'),
    ReactiveEvents.complete(250)
  ])

  const b$$ = sh.Hot([
    ReactiveEvents.next(230, 'B0'),
    ReactiveEvents.next(240, 'B1'),
    ReactiveEvents.complete(250)
  ])

  const source$ = sh.Hot([
    ReactiveEvents.next(205, a$$),
    ReactiveEvents.next(225, b$$),
    ReactiveEvents.complete(300)
  ])
  const {results} = sh.start(() => from(source$).switchLatest())
  t.deepEqual(results, [
    ReactiveEvents.next(210, 'A0'),
    ReactiveEvents.next(220, 'A1'),
    ReactiveEvents.next(230, 'B0'),
    ReactiveEvents.next(240, 'B1'),
    ReactiveEvents.complete(300)
  ])
  t.deepEqual(a$$.subscriptions.map(r => r.time), [205, 225])
  t.deepEqual(b$$.subscriptions.map(r => r.time), [225, 300])
})
