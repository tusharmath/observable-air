/**
 * Created by tushar on 08/12/16.
 */
import * as t from  'assert'
import {Observable} from '../src/lib/Observable'
import {slice} from '../src/main'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

test('create' , () => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => new Observable(ob => ob.next('A')))
  t.deepEqual(results, [EVENT.next(201, 'A')])
})

test('create', () => {
  const sh = TestScheduler.of()
  const {results} = sh.start(
    () =>
      new Observable((ob, sh) => {
        sh.delay(() => ob.next('A'), 15)
      })
  )
  t.deepEqual(results, [EVENT.next(216, 'A')])
})

test('should unsubscribe', () => {
  const sh = TestScheduler.of()
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
