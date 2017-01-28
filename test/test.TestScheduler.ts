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
  const sh = TestScheduler.of({start: 0, stop: 50})
  const {results} = sh.start(() => sh.Hot([
    ReactiveEvents.next(0, '0'),
    ReactiveEvents.next(10, '1'),
    ReactiveEvents.next(20, '2'),
    ReactiveEvents.complete(30)
  ]))

  t.deepEqual(results, [
    ReactiveEvents.next(0, '0'),
    ReactiveEvents.next(10, '1'),
    ReactiveEvents.next(20, '2'),
    ReactiveEvents.complete(30)
  ])
})