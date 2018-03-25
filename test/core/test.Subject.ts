/**
 * Created by tushar on 11/01/18.
 */
import * as assert from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {ISubscription} from '../../src/core/internal/Subscription'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'
import {subject} from '../../src/core/sources/Subject'

describe('subject()', () => {
  it('should be an observable+observer', () => {
    const sh = createTestScheduler()
    const ob = sh.Observer()
    const $ = subject()
    let sub: ISubscription

    // Timeline
    sh.timeline([
      [210, () => $.next('A')],
      [220, () => (sub = $.subscribe(ob, sh))],
      [230, () => $.next('B')],
      [240, () => $.next('C')],
      [250, () => sub.unsubscribe()],
      [260, () => $.next('D')],
      [270, () => $.complete()]
    ])

    sh.advanceTo(211)
    assert.deepEqual(ob.results, []) // nothing gets captured

    sh.advanceTo(241)
    assert.deepEqual(ob.results, [EVENT.next(230, 'B'), EVENT.next(240, 'C')])

    sh.advanceTo(261)
    assert.deepEqual(ob.results, [EVENT.next(230, 'B'), EVENT.next(240, 'C')])

    sh.advanceTo(271)
    assert.deepEqual(ob.results, [EVENT.next(230, 'B'), EVENT.next(240, 'C')])
  })

  it('should be an observable+observer', () => {
    const sh = createTestScheduler()
    const ob0 = sh.Observer()
    const ob1 = sh.Observer()
    const $ = subject()
    let sb1: ISubscription
    let sb0: ISubscription

    // Timeline
    sh.timeline([
      [210, () => $.next('A')],
      // -- 211
      [220, () => (sb0 = $.subscribe(ob0, sh))],
      [230, () => $.next('B')],
      // -- 231
      [240, () => (sb1 = $.subscribe(ob1, sh))],
      [250, () => $.next('C')],
      // -- 251
      [260, () => sb1.unsubscribe()],
      [270, () => $.next('D')],
      // -- 271
      [280, () => sb0.unsubscribe()],
      [290, () => $.next('E')]
      // -- 291
    ])

    sh.advanceTo(211)
    assert.deepEqual(ob0.results, [])
    assert.deepEqual(ob1.results, [])

    sh.advanceTo(231)
    assert.deepEqual(ob0.results, [EVENT.next(230, 'B')])
    assert.deepEqual(ob1.results, [])

    sh.advanceTo(251)
    assert.deepEqual(ob0.results, [EVENT.next(230, 'B'), EVENT.next(250, 'C')])
    assert.deepEqual(ob1.results, [EVENT.next(250, 'C')])

    sh.advanceTo(271)
    assert.deepEqual(ob0.results, [
      EVENT.next(230, 'B'),
      EVENT.next(250, 'C'),
      EVENT.next(270, 'D')
    ])
    assert.deepEqual(ob1.results, [EVENT.next(250, 'C')])

    sh.advanceTo(291)
    assert.deepEqual(ob0.results, [
      EVENT.next(230, 'B'),
      EVENT.next(250, 'C'),
      EVENT.next(270, 'D')
    ])
    assert.deepEqual(ob1.results, [EVENT.next(250, 'C')])
  })
})
