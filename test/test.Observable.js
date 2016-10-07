/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../src/Observable'
import {TestScheduler} from '../src/schedulers/TestScheduler'
import {ReactiveTest} from '../src/testing/ReactiveTest'

const {next, complete} = ReactiveTest

function noop () {}
test(t => t.true(Observable.of(null) instanceof Observable))
test('subscribe()', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => new Observable(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete()
    return {unsubscribe: noop, closed: false}
  }))

  t.deepEqual(results, [
    next(201, 1),
    next(201, 2),
    next(201, 3),
    complete(201, 4)
  ])
})

test.cb('unsubscribe()', t => {
  t.plan(1)
  const results = []
  var i = 0
  const ob = new Observable(function (o) {
    const timer = setInterval(() => o.next(i++))
    return {
      unsubscribe () {
        clearInterval(timer)
        o.complete()
      }
    }
  })
  const sub = ob.subscribe({
    next: x => {
      results.push(x)
      if (x === 5) sub.unsubscribe()
    },
    complete: () => {
      t.deepEqual(results, [0, 1, 2, 3, 4, 5])
      t.end()
    }
  })
})
