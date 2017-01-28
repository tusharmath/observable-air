/**
 * Created by tushar on 28/01/17.
 */
import {TestScheduler} from '../src/testing/TestScheduler'
import {test} from 'ava'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'

test(t => {
  const sh = TestScheduler.of()
  t.is(sh.now(), 0)

  sh.advanceBy(10)
  t.is(sh.now(), 10)

  sh.advanceBy(2)
  t.is(sh.now(), 12)

  sh.advanceTo(20)
  t.is(sh.now(), 20)
})


test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => sh.Hot([
    ReactiveEvents.next(210, '0'),
    ReactiveEvents.next(220, '1'),
    ReactiveEvents.next(230, '2'),
    ReactiveEvents.complete(240)
  ]))

  t.deepEqual(results, [
    ReactiveEvents.next(210, '0'),
    ReactiveEvents.next(220, '1'),
    ReactiveEvents.next(230, '2'),
    ReactiveEvents.complete(240)
  ])
})