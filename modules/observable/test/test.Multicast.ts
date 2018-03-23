/**
 * Created by tushar.mathur on 24/10/16.
 */

import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {TestObserver} from '../src/internal/TestObserver'
import {map} from '../src/operators/Map'
import {multicast} from '../src/operators/Multicast'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

describe('multicast()', () => {
  it('should subscribe only once', () => {
    let i = 0
    const sh = createTestScheduler()
    const ob0 = new TestObserver(sh)
    const ob1 = new TestObserver(sh)
    const t$ = multicast(
      map(
        (x: {(): number}) => x(),
        sh.Hot([
          EVENT.next(10, () => ++i),
          EVENT.next(20, () => ++i),
          EVENT.next(30, () => ++i),
          EVENT.next(40, () => ++i),
          EVENT.next(50, () => ++i)
        ])
      )
    )
    t$.subscribe(ob0, sh)
    t$.subscribe(ob1, sh)
    sh.advanceBy(50)
    t.deepEqual(ob0, ob1)
    t.deepEqual(ob0.results, [
      EVENT.next(10, 1),
      EVENT.next(20, 2),
      EVENT.next(30, 3),
      EVENT.next(40, 4),
      EVENT.next(50, 5)
    ])
  })
})
