/**
 * Created by tushar on 08/12/16.
 */
import test from 'ava'
import {Observable} from '../src/sources/Create'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => new Observable(ob => ob.next('A')))
  t.deepEqual(results, [EVENT.next(200, 'A')])
})

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(
    () =>
      new Observable((ob, sh) => {
        sh.delay(() => ob.next('A'), 15)
      })
  )
  t.deepEqual(results, [EVENT.next(215, 'A')])
})
