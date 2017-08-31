/**
 * Created by pankaj on 9/1/17.
 */
import {assert} from 'chai'
import {EVENT} from './Events'
import {TestScheduler} from './TestScheduler'


describe('TestScheduler', () => {
  it('should update scheduler', () => {
    const sh = TestScheduler.of()
    assert.equal(sh.now(), 0)

    sh.advanceBy(10)
    assert.equal(sh.now(), 10)

    sh.advanceBy(2)
    assert.equal(sh.now(), 12)

    sh.advanceTo(20)
    assert.equal(sh.now(), 20)
  })
  it('should emit events as scheduled', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() =>
      sh.Hot([
        EVENT.next(210, '0'),
        EVENT.next(220, '1'),
        EVENT.next(230, '2'),
        EVENT.complete(240)
      ])
    )

    assert.deepEqual(results, [
      EVENT.next(210, '0'),
      EVENT.next(220, '1'),
      EVENT.next(230, '2'),
      EVENT.complete(240)
    ])
  })
})