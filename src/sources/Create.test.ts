/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {Observable} from './Create'

describe('create', () => {
  it('should create a new Observable', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => new Observable(ob => ob.next('A')))
    assert.deepEqual(results, [EVENT.next(200, 'A')])
  })
  it('should create a new Observable after some delay', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(
      () =>
        new Observable((ob, sh) => {
          sh.delay(() => ob.next('A'), 15)
        })
    )
    assert.deepEqual(results, [EVENT.next(215, 'A')])
  })
})