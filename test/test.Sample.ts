/**
 * Created by tushar.mathur on 19/10/16.
 */
import test from 'ava'
import {sample} from '../src/operators/Sample'
import {EVENT} from '../src/testing/Events'
import {marble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

function toArray (...t: Array<any>) {
  return t.join(',')
}
test(t => {
  const sh = TestScheduler.of()
  const a$ = sh.Hot([
    EVENT.next(210, 'A0'),
    EVENT.next(230, 'A1'),
    EVENT.next(250, 'A2'),
    EVENT.complete(250)
  ])
  const b$ = sh.Hot([
    EVENT.next(210, 'B0'),
    EVENT.next(220, 'B1'),
    EVENT.next(230, 'B2'),
    EVENT.next(240, 'B3'),
    EVENT.complete(240)
  ])
  const S$ = sh.Hot([
    EVENT.next(211, '#'),
    EVENT.next(221, '#'),
    EVENT.next(231, '#'),
    EVENT.next(241, '#'),
    EVENT.next(251, '#'),
    EVENT.complete(251)
  ])
  const {results} = sh.start(() => sample(toArray, S$, [a$, b$]))
  t.deepEqual(results, [
    EVENT.next(211, 'A0,B0'),
    EVENT.next(221, 'A0,B1'),
    EVENT.next(231, 'A1,B2'),
    EVENT.next(241, 'A1,B3'),
    EVENT.next(251, 'A2,B3'),
    EVENT.complete(251)
  ])
})

test(t => {
  const sh = TestScheduler.of()
  const a$ = sh.Hot([
    EVENT.next(210, 0),
    EVENT.next(230, 1),
    EVENT.next(250, 2),
    EVENT.complete(250)
  ])
  const b$ = sh.Hot([
    EVENT.next(210, 0),
    EVENT.next(220, 1000),
    EVENT.next(230, 2000),
    EVENT.next(240, 3000),
    EVENT.complete(240)
  ])
  const S$ = sh.Hot([
    EVENT.next(211, '#'),
    EVENT.next(221, '#'),
    EVENT.next(231, '#'),
    EVENT.next(241, '#'),
    EVENT.next(251, '#'),
    EVENT.complete(251)
  ])
  const {results} = sh.start(() => sample((a, b) => a + b, S$, [a$, b$]))
  t.deepEqual(results, [
    EVENT.next(211, 0 + 0),
    EVENT.next(221, 0 + 1000),
    EVENT.next(231, 1 + 2000),
    EVENT.next(241, 1 + 3000),
    EVENT.next(251, 2 + 3000),
    EVENT.complete(251)
  ])
})


test(t => {
  const sh = TestScheduler.of()
  const t1$ = sh.Hot(marble('-A-B-C-D'))
  const t2$ = sh.Hot(marble('--a-b-c-d'))
  const {results} = sh.start(() => sample((a, b) => a + b, t2$, [t1$, t2$]))
  t.deepEqual(results, [
    EVENT.next(220, 'Aa'),
    EVENT.next(240, 'Bb'),
    EVENT.next(260, 'Cc'),
    EVENT.next(280, 'Dd')
  ])
})
