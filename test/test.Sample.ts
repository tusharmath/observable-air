/**
 * Created by tushar.mathur on 19/10/16.
 */
import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble} from '../src/internal/Marble'
import {sample} from '../src/operators/Sample'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

function toArray(...t: Array<any>) {
  return t.join(',')
}

describe('sample()', () => {
  it('should sample multiple sources', () => {
    const sh = createTestScheduler()
    const a$ = sh.Hot([
      EVENT.next(201, 'A0'),
      EVENT.next(203, 'A1'),
      EVENT.next(205, 'A2'),
      EVENT.complete(205)
    ])
    const b$ = sh.Hot([
      EVENT.next(201, 'B0'),
      EVENT.next(202, 'B1'),
      EVENT.next(203, 'B2'),
      EVENT.next(204, 'B3'),
      EVENT.complete(204)
    ])
    const S$ = sh.Hot([
      EVENT.next(201, '#'),
      EVENT.next(202, '#'),
      EVENT.next(203, '#'),
      EVENT.next(204, '#'),
      EVENT.next(205, '#'),
      EVENT.complete(205)
    ])
    const {results} = sh.start(() => sample(toArray, S$, [a$, b$]))
    t.deepEqual(results, [
      EVENT.next(201, 'A0,B0'),
      EVENT.next(202, 'A0,B1'),
      EVENT.next(203, 'A1,B2'),
      EVENT.next(204, 'A1,B3'),
      EVENT.next(205, 'A2,B3'),
      EVENT.complete(205)
    ])
  })

  it('should sample()', () => {
    const sh = createTestScheduler()
    const a$ = sh.Hot([
      EVENT.next(201, 0),
      EVENT.next(203, 1),
      EVENT.next(205, 2),
      EVENT.complete(205)
    ])
    const b$ = sh.Hot([
      EVENT.next(201, 0),
      EVENT.next(202, 1000),
      EVENT.next(203, 2000),
      EVENT.next(204, 3000),
      EVENT.complete(204)
    ])
    const S$ = sh.Hot([
      EVENT.next(201, '#'),
      EVENT.next(202, '#'),
      EVENT.next(203, '#'),
      EVENT.next(204, '#'),
      EVENT.next(205, '#'),
      EVENT.complete(205)
    ])
    const {results} = sh.start(() => sample((a, b) => a + b, S$, [a$, b$]))
    t.deepEqual(results, [
      EVENT.next(201, 0 + 0),
      EVENT.next(202, 0 + 1000),
      EVENT.next(203, 1 + 2000),
      EVENT.next(204, 1 + 3000),
      EVENT.next(205, 2 + 3000),
      EVENT.complete(205)
    ])
  })

  it('should sample()', () => {
    const sh = createTestScheduler()
    const t1$ = sh.Hot(fromMarble('-A-B-C-D'))
    const t2$ = sh.Hot(fromMarble('--a-b-c-d'))
    const {results} = sh.start(() => sample((a, b) => a + b, t2$, [t1$, t2$]))
    t.deepEqual(results, [
      EVENT.next(202, 'Aa'),
      EVENT.next(204, 'Bb'),
      EVENT.next(206, 'Cc'),
      EVENT.next(208, 'Dd')
    ])
  })
})
