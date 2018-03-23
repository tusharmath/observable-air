/**
 * Created by tushar on 08/12/16.
 */
import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {Observable} from '../src/internal/Observable'
import {slice} from '../src/main'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

describe('new Observable()', () => {
  it('should emit values via next()', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() => new Observable(ob => ob.next('A')))
    t.deepEqual(results, [EVENT.next(201, 'A')])
  })

  it('should be subscribe-able', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(
      () =>
        new Observable((ob, sh) => {
          sh.delay(() => ob.next('A'), 15)
        })
    )
    t.deepEqual(results, [EVENT.next(216, 'A')])
  })

  it('should unsubscribe', () => {
    const sh = createTestScheduler()
    const actual = sh.start(() =>
      slice(
        0,
        3,
        new Observable(ob => {
          let done = false
          for (let i = 0; i < 10 && !done; i++) ob.next(i)
          ob.complete()
          return () => (done = true)
        })
      )
    ).results

    const expected = [
      EVENT.next(201, 0),
      EVENT.next(201, 1),
      EVENT.next(201, 2),
      EVENT.complete(201)
    ]

    t.deepEqual(actual, expected)
  })
})
