import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble} from '../src/internal/Marble'
import {IObservable} from '../src/internal/Observable'
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
      complete(205)
    ]) as IObservable<number | Error>
    const {results} = sh.start(() => recoverWith((err: Error) => err, $))
    t.deepEqual(results, [
      next(400, 10),
      next(401, new Error('err1')),
      next(402, new Error('err2')),
      complete(405)
    ])
  })
  it('(marble): should emit errors as data', () => {
    const SH = createTestScheduler()
    const {results} = SH.start(() => {
      return recoverWith((err: Error) => 1, SH.Hot(fromMarble('a-b-#-c-#-d|')))
    })
    t.deepEqual(results, [
      EVENT.next(200, 'a'),
      EVENT.next(202, 'b'),
      EVENT.next(204, 1),
      EVENT.next(206, 'c'),
      EVENT.next(208, 1),
      EVENT.next(210, 'd'),
      EVENT.complete(211)
    ])
  })
})
