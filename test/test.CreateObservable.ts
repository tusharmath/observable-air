/**
 * Created by tushar on 08/12/16.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {create} from '../src/main'

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => create(ob => ob.next('A')))
  t.deepEqual(results, [
    ReactiveEvents.next(200, 'A')
  ])
})

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => create((ob, sh) => {
    sh.setTimeout(() => ob.next('A'), 15)
  }))
  t.deepEqual(results, [
    ReactiveEvents.next(215, 'A')
  ])
})
