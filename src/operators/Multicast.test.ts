/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestObserver} from '../testing/TestObserver'
import {TestScheduler} from '../testing/TestScheduler'
import {map} from './Map'
import {multicast} from './Multicast'


describe('multicast', () => {
  it('should multicast', () => {
    let i = 0
    const sh = TestScheduler.of()
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
    assert.deepEqual(ob0, ob1)
    assert.deepEqual(ob0.results, [
      EVENT.next(10, 1),
      EVENT.next(20, 2),
      EVENT.next(30, 3),
      EVENT.next(40, 4),
      EVENT.next(50, 5)
    ])
  })
})