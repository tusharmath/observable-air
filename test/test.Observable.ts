/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../src/Observable'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveTest} from '../src/testing/ReactiveTest'

const {next, complete, error} = ReactiveTest

function noop () {}
test('subscribe()', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => new Observable(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete()
    return {unsubscribe: noop, closed: false}
  }))

  t.deepEqual(results, [
    next(200, 1),
    next(200, 2),
    next(200, 3),
    complete(200, 4)
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

test('void subscription', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => new Observable(noop))
  t.deepEqual(results, [])
})

test('subscription () => void', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => new Observable(() => () => null))
  t.deepEqual(results, [])
})

test('static of', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => Observable.of(100, 200, 300))
  t.deepEqual(results, [
    next(200, 100),
    next(200, 200),
    next(200, 300),
    complete(200)
  ])
})

test('error()', t => {
  const sh = new TestScheduler()
  const {results} = sh.startScheduler(() => new Observable(() => {
    throw Error('Yo')
  }))
  t.deepEqual(results, [
    error(200, new Error())
  ])
  t.is(results[0].value.message, 'Yo')
})
