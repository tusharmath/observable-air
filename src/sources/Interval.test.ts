/**
 * Created by pankaj on 8/31/17.
 */

import {assert} from 'chai'
import {scan} from '../operators/Scan'
import {EVENT, EventError} from '../testing/Events'
import {toMarble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../testing/Thrower'
import {interval} from './Interval'
const {error} = EVENT

describe('Interval', () => {
  it('should subscribe', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => scan(i => i + 1, -1, interval(10)), 200, 250)
    assert.equal(toMarble(results), '-0123')
  })
  it.skip('should throw error', () => {
    const sh = TestScheduler.of()
    const observer = sh.Observer<void>()
    thrower(interval(100)).subscribe(observer, sh)
    sh.advanceBy(100)
    assert.deepEqual(observer.results, [error(100, Error(ERROR_MESSAGE))])
    assert.equal((observer.results[0] as EventError).value.message, ERROR_MESSAGE)
  })
})