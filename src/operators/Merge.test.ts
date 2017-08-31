/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {merge} from './Merge'

describe('merge', () => {
  it('should merge', () => {
    const sh = TestScheduler.of()
    const a$ = sh.Hot([
      EVENT.next(210, 'A0'),
      EVENT.next(220, 'A1'),
      EVENT.complete(230)
    ])
    const b$ = sh.Hot([
      EVENT.next(212, 'B0'),
      EVENT.next(222, 'B1'),
      EVENT.complete(232)
    ])
    const c$ = sh.Hot([
      EVENT.next(215, 'C0'),
      EVENT.next(225, 'C1'),
      EVENT.complete(235)
    ])
    const {results} = sh.start(() => merge(a$, b$, c$))
    assert.deepEqual(results, [
      EVENT.next(210, 'A0'),
      EVENT.next(212, 'B0'),
      EVENT.next(215, 'C0'),
      EVENT.next(220, 'A1'),
      EVENT.next(222, 'B1'),
      EVENT.next(225, 'C1'),
      EVENT.complete(235)
    ])
  })
})