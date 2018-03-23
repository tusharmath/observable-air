/**
 * Created by tushar.mathur on 27/09/16.
 */

import * as t from 'assert'
import {EVENT, EventError} from '../src/internal/Events'
import {toMarble} from '../src/internal/Marble'
import {ERROR_MESSAGE, thrower, throwError} from '../src/internal/Thrower'
import {scan} from '../src/operators/Scan'
import {createTestScheduler} from '../src/schedulers/TestScheduler'
import {interval} from '../src/sources/Interval'
const {error} = EVENT

describe('interval()', () => {
  it('should emit values every t ms', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(
      () => scan(i => i + 1, -1, interval(10)),
      200,
      250
    )
    t.strictEqual(toMarble(results), '-0123')
  })
  it('should catch exceptions', () => {
    const sh = createTestScheduler()
    const observer = sh.Observer<void>()
    thrower(interval(100)).subscribe(observer, sh)
    sh.advanceBy(100)
    t.deepEqual(observer.results, [error(100, Error(ERROR_MESSAGE))])
    t.strictEqual(
      (observer.results[0] as EventError).value.message,
      ERROR_MESSAGE
    )
  })

  it('should stop after error', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      scan(i => (i === 5 ? throwError('Yay!') : i + 1), 0, interval(20))
    )
    const expected = '--1-2-3-4-5-#'
    t.strictEqual(toMarble(results), expected)
  })
})
