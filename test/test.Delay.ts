/**
 * Created by tushar on 29/01/17.
 */
import * as t from 'assert'
import {delay} from '../src/operators/Delay'
import {EVENT} from '../src/testing/Events'
import {fromMarble, toMarble} from '../src/testing/Marble'
import {createTestScheduler} from '../src/testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../src/testing/Thrower'

describe('delay()', () => {
  it('should delay the source events', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() => delay(20, sh.Hot(fromMarble('12345|'))))
    t.strictEqual(toMarble(results), '--12345|')
  })

  it('should forward error', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() => delay(20, sh.Hot(fromMarble('--#|'))))
    t.strictEqual(toMarble(results), '--#--|')
  })

  it('should catch internal exception', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      thrower(delay(20, sh.Hot(fromMarble('0'))))
    )
    t.deepEqual(results, [EVENT.error(220, Error(ERROR_MESSAGE))])
  })

  it('should unsubscribe', () => {
    const sh = createTestScheduler()
    sh.start(() => delay(50, sh.Hot(fromMarble('0'))), 200, 230)
    t.strictEqual(sh.length, 0)
  })
})
