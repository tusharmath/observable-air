/**
 * Created by tushar.mathur on 17/10/16.
 */
import test from 'ava'
import {fromPromise} from '../src/sources/FromPromise'
import {createScheduler} from '../src/lib/DefaultScheduler'

test.cb(t => {
  t.plan(1)
  const results: number[] = []
  const s$ = fromPromise<number>(() => new Promise(function (resolve) {
    resolve(100)
  }))
  s$.subscribe({
    next: (x: number) => results.push(x),
    complete: () => {
      t.deepEqual(results, [100])
      t.end()
    },
    error: (err: Error) => {
      throw err
    }
  }, createScheduler())
})
