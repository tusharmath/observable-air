/**
 * Created by tushar.mathur on 17/10/16.
 */
import * as t from 'assert'
import {createScheduler} from '../../src/core/schedulers/Scheduler'
import {fromPromise} from '../../src/core/sources/FromPromise'

describe('fromPromise()', () => {
  it('should emit the value of the promise', cb => {
    const results: number[] = []
    const s$ = fromPromise<number>(
      () =>
        new Promise(function(resolve) {
          resolve(100)
        })
    )
    s$.subscribe(
      {
        next: (x: number) => results.push(x),
        complete: () => {
          t.deepEqual(results, [100])
          cb()
        },
        error: (err: Error) => {
          throw err
        }
      },
      createScheduler()
    )
  })
})
