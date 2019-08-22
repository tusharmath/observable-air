import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble} from '../src/internal/Marble'
import {just} from '../src/main'
import {recoverWith} from '../src/operators/RecoverWith'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

const {next, complete, error} = EVENT

describe('recoverWith()', () => {
  it('should emit errors as data', () => {
    const sh = createTestScheduler()
    const $ = sh.Cold<number>([
      next(200, 10),
      error(201, new Error('err1')),
      error(202, new Error('err2')),
      next(203, 10),
      complete(205)
    ])
    const {results} = sh.start(() => recoverWith((err: Error) => just(-1), $))
    t.deepEqual(results, [
      next(401, 10),
      next(402, -1),
      next(403, -1),
      next(404, 10),
      complete(405)
    ])
  })
  it('(marble): should emit errors as data', () => {
    const SH = createTestScheduler()
    const source$ = SH.Cold(fromMarble('a-b-#-c-#-d|'))
    const o$ = SH.Cold(fromMarble('z-x-y-w-|'))
    const {results} = SH.start(() => {
      return recoverWith((err: Error) => o$, source$)
    })
    t.deepEqual(results, [
      EVENT.next(401, 'a'),
      EVENT.next(403, 'b'),
      EVENT.next(407, 'c'),
      EVENT.next(411, 'd'),
      EVENT.next(604, 'z'),
      EVENT.next(606, 'x'),
      EVENT.next(608, 'y'),
      EVENT.next(608, 'z'),
      EVENT.next(610, 'w'),
      EVENT.next(610, 'x'),
      EVENT.next(612, 'y'),
      EVENT.next(614, 'w'),
      EVENT.complete(616)
    ])
  })
})
