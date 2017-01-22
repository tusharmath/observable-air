/**
 * Created by tushar.mathur on 19/10/16.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {marble} from '../src/testing/Marble'
import {air} from '../src/main'

function toArray (...t: Array<any>) {
  return t.join(',')
}
test(t => {
  const sh = TestScheduler.of()
  const a$ = sh.Hot([
    ReactiveEvents.next(210, 'A0'),
    ReactiveEvents.next(230, 'A1'),
    ReactiveEvents.next(250, 'A2'),
    ReactiveEvents.complete(250)
  ])
  const b$ = sh.Hot([
    ReactiveEvents.next(210, 'B0'),
    ReactiveEvents.next(220, 'B1'),
    ReactiveEvents.next(230, 'B2'),
    ReactiveEvents.next(240, 'B3'),
    ReactiveEvents.complete(240)
  ])
  const S$ = sh.Hot([
    ReactiveEvents.next(211, '#'),
    ReactiveEvents.next(221, '#'),
    ReactiveEvents.next(231, '#'),
    ReactiveEvents.next(241, '#'),
    ReactiveEvents.next(251, '#'),
    ReactiveEvents.complete(251)
  ])
  const {results} = sh.start(() => air(S$).sample(toArray, [a$, b$]))
  t.deepEqual(results, [
    ReactiveEvents.next(211, 'A0,B0'),
    ReactiveEvents.next(221, 'A0,B1'),
    ReactiveEvents.next(231, 'A1,B2'),
    ReactiveEvents.next(241, 'A1,B3'),
    ReactiveEvents.next(251, 'A2,B3'),
    ReactiveEvents.complete(251)
  ])
})

test(t => {
  const sh = TestScheduler.of()
  const a$ = sh.Hot([
    ReactiveEvents.next(210, 0),
    ReactiveEvents.next(230, 1),
    ReactiveEvents.next(250, 2),
    ReactiveEvents.complete(250)
  ])
  const b$ = sh.Hot([
    ReactiveEvents.next(210, 0),
    ReactiveEvents.next(220, 1000),
    ReactiveEvents.next(230, 2000),
    ReactiveEvents.next(240, 3000),
    ReactiveEvents.complete(240)
  ])
  const S$ = sh.Hot([
    ReactiveEvents.next(211, '#'),
    ReactiveEvents.next(221, '#'),
    ReactiveEvents.next(231, '#'),
    ReactiveEvents.next(241, '#'),
    ReactiveEvents.next(251, '#'),
    ReactiveEvents.complete(251)
  ])
  const {results} = sh.start(() => air(S$).sample((a, b) => a + b, [a$, b$]))
  t.deepEqual(results, [
    ReactiveEvents.next(211, 0 + 0),
    ReactiveEvents.next(221, 0 + 1000),
    ReactiveEvents.next(231, 1 + 2000),
    ReactiveEvents.next(241, 1 + 3000),
    ReactiveEvents.next(251, 2 + 3000),
    ReactiveEvents.complete(251)
  ])
})


test(t => {
  const sh = TestScheduler.of()
  const t1$ = sh.Hot(marble('-A-B-C-D'))
  const t2$ = sh.Hot(marble('--a-b-c-d'))
  const {results} = sh.start(() => air(t2$).sample((a, b) => a + b, [t1$, t2$]))
  t.deepEqual(results, [
    ReactiveEvents.next(220, 'Aa'),
    ReactiveEvents.next(240, 'Bb'),
    ReactiveEvents.next(260, 'Cc'),
    ReactiveEvents.next(280, 'Dd')
  ])
})
