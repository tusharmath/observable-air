/**
 * Created by tushar on 29/01/17.
 */
import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble, toMarble} from '../src/internal/Marble'
import {ERROR_MESSAGE, thrower} from '../src/internal/Thrower'
import {delay} from '../src/operators/Delay'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

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
