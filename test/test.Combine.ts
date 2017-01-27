/**
 * Created by tushar on 08/12/16.
 */
import test from 'ava'
import {combine} from '../src/operators/Combine'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble} from '../src/testing/Marble'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'

test(t => {
  const S = TestScheduler.of()
  const a$ = S.Hot(marble('-a-b-c|'))
  const b$ = S.Hot(marble('--A-B-C--|'))
  const {results} = S.start(() => combine((a, b) => a + b, [a$, b$]))

  t.deepEqual(results, [
    ReactiveEvents.next(220, 'aA'),
    ReactiveEvents.next(230, 'bA'),
    ReactiveEvents.next(240, 'bB'),
    ReactiveEvents.next(250, 'cB'),
    ReactiveEvents.next(260, 'cC'),
    ReactiveEvents.complete(290)
  ])
})
