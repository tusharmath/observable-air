/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {marble, toMarble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../testing/Thrower'
import {delay} from './Delay'

describe('delay', () => {
  it('should delay', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => delay(20, sh.Hot(marble('12345|'))))
    assert.equal(toMarble(results), '--12345|')
  })
  it('should throw error', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => delay(20, sh.Hot(marble('--#|'))))
    assert.equal(toMarble(results), '--#--|')
  })
  it.skip('should throw exception', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => thrower(delay(20, sh.Hot(marble('0')))))
    assert.deepEqual(results, [EVENT.error(220, Error(ERROR_MESSAGE))])
  })
  it('should unsubscribe', () => {
    const sh = TestScheduler.of()
    sh.start(() => delay(50, sh.Hot(marble('0'))), 200, 230)
    assert.equal(sh.length, 0)
  })
})