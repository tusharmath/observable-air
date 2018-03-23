/**
 * Created by tushar.mathur on 17/10/16.
 */

import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {merge} from '../src/operators/Merge'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

describe('merge', () => {
  it('should merge multiple source streams', () => {
    const sh = createTestScheduler()
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
    t.deepEqual(results, [
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
