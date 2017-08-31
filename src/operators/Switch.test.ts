/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {switchLatest} from './Switch'

describe('switch', () => {
  it('should switch', () => {
    const sh = TestScheduler.of()
    const a$$ = sh.Hot([
      EVENT.next(210, 'A0'),
      EVENT.next(220, 'A1'),
      EVENT.next(230, 'A2'),
      EVENT.next(240, 'A3'),
      EVENT.complete(250)
    ])

    const b$$ = sh.Hot([
      EVENT.next(230, 'B0'),
      EVENT.next(240, 'B1'),
      EVENT.complete(250)
    ])

    const source$ = sh.Hot([
      EVENT.next(205, a$$),
      EVENT.next(225, b$$),
      EVENT.complete(300)
    ])
    const {results} = sh.start(() => switchLatest(source$))
    assert.deepEqual(results, [
      EVENT.next(210, 'A0'),
      EVENT.next(220, 'A1'),
      EVENT.next(230, 'B0'),
      EVENT.next(240, 'B1'),
      EVENT.complete(300)
    ])
    assert.deepEqual(a$$.subscriptions.map(r => r.time), [205, 225])
    assert.deepEqual(b$$.subscriptions.map(r => r.time), [225, 300])
  })
})