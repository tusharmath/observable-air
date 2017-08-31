/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {marble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {sample} from './Sample'

describe('sample', () => {
  const toArray = (...t: Array<any>) => t.join(',')
  it('should sample', () => {
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
    assert.deepEqual(results, [
      EVENT.next(211, 'A0,B0'),
      EVENT.next(221, 'A0,B1'),
      EVENT.next(231, 'A1,B2'),
      EVENT.next(241, 'A1,B3'),
      EVENT.next(251, 'A2,B3'),
      EVENT.complete(251)
    ])
  })
  it('sample2', () => {
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
    assert.deepEqual(results, [
      EVENT.next(211, 0 + 0),
      EVENT.next(221, 0 + 1000),
      EVENT.next(231, 1 + 2000),
      EVENT.next(241, 1 + 3000),
      EVENT.next(251, 2 + 3000),
      EVENT.complete(251)
    ])
  })
  it('sample3', () => {
    const sh = TestScheduler.of()
    const t1$ = sh.Hot(marble('-A-B-C-D'))
    const t2$ = sh.Hot(marble('--a-b-c-d'))
    const {results} = sh.start(() => sample((a, b) => a + b, t2$, [t1$, t2$]))
    assert.deepEqual(results, [
      EVENT.next(220, 'Aa'),
      EVENT.next(240, 'Bb'),
      EVENT.next(260, 'Cc'),
      EVENT.next(280, 'Dd')
    ])
  })
})